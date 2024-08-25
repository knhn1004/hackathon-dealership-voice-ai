require('dotenv').config();

const VoiceResponse = require('twilio').twiml.VoiceResponse;
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = require('twilio')(accountSid, authToken);

const testScenarios = [
	{
		name: 'Check car availability and price',
		script: `Hi, I'm interested in your sedans. How many do you have available and what's the price range?`,
	},
	{
		name: 'Schedule test drive with all details',
		script: `I'd like to schedule a test drive for a truck this Saturday at 2 PM. My name is John Doe and my phone number is 555-123-4567.`,
	},
	{
		name: 'Check maintenance schedule and schedule service',
		script: `I have a sedan with 20,000 miles. When is the next maintenance due? Also, I'd like to schedule it for next Tuesday at 10 AM if possible.`,
	},
	{
		name: 'Schedule oil change with all details',
		script:
			'I need to schedule an oil change for my sports car. Can I book it for next Wednesday at 3 PM? My name is Jane Smith, phone number 555-987-6543.',
	},
	{
		name: 'Check availability, price, and schedule test drive',
		script: `What SUVs do you have available, and how much do they cost? If you have any, I'd like to schedule a test drive for this Friday at 4 PM. My name is Alex Johnson, number is 555-246-8135.`,
	},
	{
		name: 'Transfer to real person',
		script: `I'd like to speak with a real person please.`,
	},
	{
		name: 'Complex inquiry',
		script: `I'm looking for a fuel-efficient sedan under $30,000. What models do you have? And can I schedule a maintenance check for my current car which has 15,000 miles on it?`,
	},
];

async function makeInboundCall(scenario) {
	let twiml = new VoiceResponse();
	twiml.pause({ length: 5 });
	twiml.say(scenario.script);
	twiml.pause({ length: 30 });
	if (scenario.name === 'Transfer to real person') {
		twiml.hangup();
	} else {
		twiml.say('Thank you for your inquiry. Goodbye.');
		twiml.hangup();
	}

	console.log(`Making inbound call for scenario: ${scenario.name}`);
	console.log(twiml.toString());

	try {
		const call = await client.calls.create({
			twiml: twiml.toString(),
			to: process.env.APP_NUMBER,
			from: process.env.FROM_NUMBER,
		});
		console.log(`Call SID for ${scenario.name}: ${call.sid}`);
	} catch (error) {
		console.error(`Error making call for ${scenario.name}:`, error);
	}
}

async function runAllScenarios() {
	for (const scenario of testScenarios) {
		await makeInboundCall(scenario);
		// Wait for 120 seconds between calls to avoid overwhelming the system
		await new Promise(resolve => setTimeout(resolve, 120000));
	}
}

runAllScenarios();
