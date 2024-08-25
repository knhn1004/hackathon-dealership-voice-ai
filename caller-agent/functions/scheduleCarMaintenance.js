const dbService = require('../services/db-service');
const { parseRelativeDateTime } = require('./dateTimeUtils');

async function scheduleCarMaintenance(functionArgs) {
	const { model, date, time, serviceType, customerName, phoneNumber, callSid } =
		functionArgs;
	console.log('GPT -> called scheduleCarMaintenance function');

	try {
		const parsedDateTime = parseRelativeDateTime(`${date} ${time}`);
		const appointmentDate = parsedDateTime.date || date;
		const appointmentTime = parsedDateTime.time || time;

		const appointmentId = await dbService.create('maintenance_appointments', {
			model,
			date: appointmentDate,
			time: appointmentTime,
			serviceType,
			customerName,
			phoneNumber,
			createdAt: new Date(),
		});

		const confirmationMessage = `Your ${serviceType} appointment for a ${model} has been scheduled for ${appointmentDate} at ${appointmentTime}. Appointment ID: ${appointmentId}`;

		return JSON.stringify({ confirmation: confirmationMessage });
	} catch (error) {
		console.error('Error scheduling maintenance:', error);
		return JSON.stringify({
			error: 'Failed to schedule maintenance. Please try again.',
		});
	}
}

module.exports = scheduleCarMaintenance;
