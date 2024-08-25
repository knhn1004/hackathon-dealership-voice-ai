async function checkMaintenanceSchedule(functionArgs) {
	const { model, mileage } = functionArgs;
	console.log('GPT -> called checkMaintenanceSchedule function');

	// In a real application, you would check a database or external service
	// This is a simplified example
	let nextService, mileageUntilService;

	if (mileage < 5000) {
		nextService = 'Oil change';
		mileageUntilService = 5000 - mileage;
	} else if (mileage < 30000) {
		nextService = 'Tire rotation';
		mileageUntilService = 30000 - mileage;
	} else {
		nextService = 'Major service';
		mileageUntilService = 60000 - mileage;
	}

	return JSON.stringify({
		nextService,
		mileageUntilService,
	});
}

module.exports = checkMaintenanceSchedule;
