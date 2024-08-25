require('colors');
const EventEmitter = require('events');
const OpenAI = require('openai');
const tools = require('../functions/function-manifest');
const dbService = require('./db-service');

// Import all functions included in function manifest
// Note: the function name and file name must be the same
const availableFunctions = {};
tools.forEach(tool => {
	let functionName = tool.function.name;
	availableFunctions[functionName] = require(`../functions/${functionName}`);
});

class GptService extends EventEmitter {
	constructor() {
		super();
		this.openai = new OpenAI();
		this.callSid = null;
		this.toolsUsed = [];
		(this.userContext = [
			{
				role: 'system',
				content:
					"You are a virtual assistant for a car dealership that sales cars and maintenance services. You have a friendly and professional personality. Keep your responses brief but informative. Don't ask more than 1 question at a time. Don't make assumptions about what values to plug into functions. Ask for clarification if a user request is ambiguous. Speak out all prices in US dollars. Please help customers choose between sedan, SUV, truck, and sports car models by asking about their needs and preferences. Once you know which model they're interested in, offer to check availability, provide pricing information, or schedule a test drive. Add a '•' symbol every 5 to 10 words at natural pauses where your response can be split for text to speech.",
			},
			{
				role: 'assistant',
				content: 'Welcome to our car dealership! How can I assist you today?',
			},
		]),
			(this.partialResponseIndex = 0);
	}

	// Add the callSid to the chat context in case
	// ChatGPT decides to transfer the call.
	setCallSid(callSid) {
		this.callSid = callSid;
		console.log(`GptService: callSid set to ${callSid}`);
		this.userContext.push({ role: 'system', content: `callSid: ${callSid}` });
	}

	validateFunctionArgs(args) {
		try {
			return JSON.parse(args);
		} catch (error) {
			console.log(
				'Warning: Double function arguments returned by OpenAI:',
				args
			);
			// Seeing an error where sometimes we have two sets of args
			if (args.indexOf('{') != args.lastIndexOf('{')) {
				return JSON.parse(
					args.substring(args.indexOf(''), args.indexOf('}') + 1)
				);
			}
		}
	}

	updateUserContext(name, role, text) {
		if (name !== 'user') {
			this.userContext.push({ role: role, name: name, content: text });
		} else {
			this.userContext.push({ role: role, content: text });
		}
	}

	async completion(text, interactionCount, role = 'user', name = 'user') {
		this.updateUserContext(name, role, text);
		// Store transcription in MongoDB
		await dbService.create('transcriptions', {
			callSid: this.callSid,
			role: role,
			content: text,
			timestamp: new Date(),
		});

		// Step 1: Send user transcription to Chat GPT
		const stream = await this.openai.chat.completions.create({
			model: 'gpt-4o',
			messages: this.userContext,
			tools: tools,
			stream: true,
		});

		let completeResponse = '';
		let partialResponse = '';
		let functionName = '';
		let functionArgs = '';
		let finishReason = '';

		function collectToolInformation(deltas) {
			let name = deltas.tool_calls[0]?.function?.name || '';
			if (name != '') {
				functionName = name;
			}
			let args = deltas.tool_calls[0]?.function?.arguments || '';
			if (args != '') {
				// args are streamed as JSON string so we need to concatenate all chunks
				functionArgs += args;
			}
		}

		for await (const chunk of stream) {
			let content = chunk.choices[0]?.delta?.content || '';
			let deltas = chunk.choices[0].delta;
			finishReason = chunk.choices[0].finish_reason;

			// Step 2: check if GPT wanted to call a function
			if (deltas.tool_calls) {
				// Step 3: Collect the tokens containing function data
				collectToolInformation(deltas);
			}

			// need to call function on behalf of Chat GPT with the arguments it parsed from the conversation
			if (finishReason === 'tool_calls') {
				// parse JSON string of args into JSON object

				const functionToCall = availableFunctions[functionName];
				const validatedArgs = this.validateFunctionArgs(functionArgs);

				// Say a pre-configured message from the function manifest
				// before running the function.
				const toolData = tools.find(
					tool => tool.function.name === functionName
				);
				const say = toolData.function.say;

				this.emit(
					'gptreply',
					{
						partialResponseIndex: null,
						partialResponse: say,
					},
					interactionCount
				);

				let functionResponse = await functionToCall(validatedArgs);

				// Step 4: send the info on the function call and function response to GPT
				this.updateUserContext(functionName, 'function', functionResponse);

				// call the completion function again but pass in the function response to have OpenAI generate a new assistant response
				await this.completion(
					functionResponse,
					interactionCount,
					'function',
					functionName
				);
				if (!this.toolsUsed.includes(functionName)) {
					this.toolsUsed.push(functionName);
				}
			} else {
				// We use completeResponse for userContext
				completeResponse += content;
				// We use partialResponse to provide a chunk for TTS
				partialResponse += content;
				// Emit last partial response and add complete response to userContext
				if (content.trim().slice(-1) === '•' || finishReason === 'stop') {
					const gptReply = {
						partialResponseIndex: this.partialResponseIndex,
						partialResponse,
					};

					this.emit('gptreply', gptReply, interactionCount);
					this.partialResponseIndex++;
					partialResponse = '';
				}
			}
		}
		this.userContext.push({ role: 'assistant', content: completeResponse });
		// Store assistant's response in MongoDB
		await dbService.create('transcriptions', {
			callSid: this.callSid,
			role: 'assistant',
			content: completeResponse,
			timestamp: new Date(),
		});
		// Update call_logs with tools used
		await dbService.update(
			'call_logs',
			{ callSid: this.callSid },
			{ $addToSet: { toolsUsed: { $each: this.toolsUsed } } }
		);
		console.log(`GPT -> user context length: ${this.userContext.length}`.green);
	}
}

module.exports = { GptService };
