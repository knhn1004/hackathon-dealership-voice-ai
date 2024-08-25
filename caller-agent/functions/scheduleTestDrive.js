const dbService = require('../services/db-service');
const { parseRelativeDateTime } = require('./dateTimeUtils');

async function scheduleTestDrive(functionArgs) {
	const { model, date, time, customerName, phoneNumber, callSid } =
		functionArgs;
	console.log('GPT -> called scheduleTestDrive function');

	try {
		const parsedDateTime = parseRelativeDateTime(`${date} ${time}`);
		const appointmentDate = parsedDateTime.date || date;
		const appointmentTime = parsedDateTime.time || time;

		const appointmentId = await dbService.create('test_drive_appointments', {
			model,
			date: appointmentDate,
			time: appointmentTime,
			customerName,
			phoneNumber,
			createdAt: new Date(),
		});

		const confirmationMessage = `Your test drive for a ${model} has been scheduled for ${appointmentDate} at ${appointmentTime}. Appointment ID: ${appointmentId}`;

		return JSON.stringify({ confirmation: confirmationMessage });
	} catch (error) {
		console.error('Error scheduling test drive:', error);
		return JSON.stringify({
			confirmation: 'Failed to schedule test drive. Please try again.',
		});
	}
}

module.exports = scheduleTestDrive;
