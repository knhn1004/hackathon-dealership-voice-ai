require('dotenv').config();
require('colors');

const express = require('express');
const ExpressWs = require('express-ws');

const { GptService } = require('./services/gpt-service');
const { StreamService } = require('./services/stream-service');
const { TranscriptionService } = require('./services/transcription-service');
const { TextToSpeechService } = require('./services/tts-service');
const { recordingService } = require('./services/recording-service');
const dbService = require('./services/db-service');

const VoiceResponse = require('twilio').twiml.VoiceResponse;

const app = express();
ExpressWs(app);

const PORT = process.env.PORT || 3000;

app.post('/incoming', (req, res) => {
	try {
		const response = new VoiceResponse();
		const connect = response.connect();
		connect.stream({ url: `wss://${process.env.SERVER}/connection` });

		res.type('text/xml');
		res.end(response.toString());
	} catch (err) {
		console.log(err);
	}
});

app.ws('/connection', ws => {
	try {
		ws.on('error', console.error);
		// Filled in from start message
		let streamSid;
		let callSid;

		const gptService = new GptService();
		const streamService = new StreamService(ws);
		const transcriptionService = new TranscriptionService();
		const ttsService = new TextToSpeechService({});

		let marks = [];
		let interactionCount = 0;

		// Incoming from MediaStream
		ws.on('message', async function message(data) {
			const msg = JSON.parse(data);
			if (msg.event === 'start') {
				streamSid = msg.start.streamSid;
				callSid = msg.start.callSid;

				// find call logs
				const callLogs = await dbService.findOne('call_logs', { callSid });
				streamService.setStreamSid(streamSid);
				gptService.setCallSid(callSid);
				if (!callLogs?.length) {
					await dbService.create('call_logs', {
						callSid,
						streamSid,
						createdAt: new Date(),
						toolsUsed: [], // Initialize empty array for tools used
					});
				}

				// Set RECORDING_ENABLED='true' in .env to record calls
				recordingService(ttsService, callSid).then(() => {
					console.log(
						`Twilio -> Starting Media Stream for ${streamSid}`.underline.red
					);
					ttsService.generate(
						{
							partialResponseIndex: null,
							partialResponse:
								"Hello! Welcome to Oliver's Car Dealership. How can I assist you today?",
						},
						0
					);
				});
			} else if (msg.event === 'media') {
				transcriptionService.send(msg.media.payload);
			} else if (msg.event === 'mark') {
				const label = msg.mark.name;
				console.log(
					`Twilio -> Audio completed mark (${msg.sequenceNumber}): ${label}`.red
				);
				marks = marks.filter(m => m !== msg.mark.name);
			} else if (msg.event === 'stop') {
				console.log(`Twilio -> Media stream ${streamSid} ended.`.underline.red);
			}
		});

		ws.on('close', async () => {
			console.log(`Twilio -> Call ${callSid} ended.`.underline.red);

			try {
				// Retrieve all transcriptions for this call
				const transcriptions = await dbService.query('transcriptions', [
					{ field: 'callSid', operator: '==', value: callSid },
				]);
				console.log(
					`Retrieved ${transcriptions.length} transcriptions for callSid: ${callSid}`
				);

				if (transcriptions.length === 0) {
					console.warn(`No transcriptions found for callSid: ${callSid}`);
				} else {
					// Sort transcriptions by timestamp
					transcriptions.sort((a, b) => a.timestamp - b.timestamp);

					// Combine all transcriptions into a single string
					const fullTranscript = transcriptions
						.map(t => `${t.role}: ${t.content}`)
						.join('\n');

					console.log('Full transcript:', fullTranscript);

					if (fullTranscript.trim() === '') {
						console.warn(
							'Full transcript is empty after combining transcriptions'
						);
					}

					// Retrieve the tools used from the call_logs
					const callLog = await dbService.findOne('call_logs', { callSid });
					const toolsUsed = callLog?.toolsUsed || [];

					// Update the call log with the full transcript and tools used
					const updateResult = await dbService.update(
						'call_logs',
						{ callSid },
						{
							fullTranscript,
							toolsUsed,
							endedAt: new Date(),
						}
					);
					console.log('Update result:', updateResult);
					console.log('Tools used in this call:', toolsUsed);
				}
			} catch (error) {
				console.error('Error processing transcriptions:', error);
			}
		});

		transcriptionService.on('utterance', async text => {
			// This is a bit of a hack to filter out empty utterances
			if (marks.length > 0 && text?.length > 5) {
				console.log('Twilio -> Interruption, Clearing stream'.red);
				ws.send(
					JSON.stringify({
						streamSid,
						event: 'clear',
					})
				);
			}
		});

		transcriptionService.on('transcription', async text => {
			if (!text) {
				return;
			}
			console.log(
				`Interaction ${interactionCount} – STT -> GPT: ${text}`.yellow
			);
			gptService.completion(text, interactionCount);
			interactionCount += 1;
		});

		gptService.on('gptreply', async (gptReply, icount) => {
			console.log(
				`Interaction ${icount}: GPT -> TTS: ${gptReply.partialResponse}`.green
			);
			ttsService.generate(gptReply, icount);
		});

		ttsService.on('speech', (responseIndex, audio, label, icount) => {
			console.log(`Interaction ${icount}: TTS -> TWILIO: ${label}`.blue);

			streamService.buffer(responseIndex, audio);
		});

		streamService.on('audiosent', markLabel => {
			marks.push(markLabel);
		});
	} catch (err) {
		console.log(err);
	}
});

app.listen(PORT);
console.log(`Server running on port ${PORT}`);
