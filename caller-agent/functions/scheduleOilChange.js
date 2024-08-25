const dbService = require('../services/db-service');
const { parseRelativeDateTime } = require('./dateTimeUtils');

async function scheduleOilChange(functionArgs) {
	const { model, date, time, customerName, phoneNumber, callSid } =
		functionArgs;
	console.log('GPT -> called scheduleOilChange function');

	try {
		const parsedDateTime = parseRelativeDateTime(`${date} ${time}`);
		const appointmentDate = parsedDateTime.date || date;
		const appointmentTime = parsedDateTime.time || time;

		const appointmentId = await dbService.create('oil_change_appointments', {
			model,
			date: appointmentDate,
			time: appointmentTime,
			customerName,
			phoneNumber,
			createdAt: new Date(),
		});

		const confirmationMessage = `Your oil change appointment for a ${model} has been scheduled for ${appointmentDate} at ${appointmentTime}. Appointment ID: ${appointmentId}`;

		return JSON.stringify({ confirmation: confirmationMessage });
	} catch (error) {
		console.error('Error scheduling oil change:', error);
		return JSON.stringify({
			error: 'Failed to schedule oil change. Please try again.',
		});
	}
}

module.exports = scheduleOilChange;
