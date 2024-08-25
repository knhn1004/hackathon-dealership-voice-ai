async function checkCarAvailability(functionArgs) {
	const model = functionArgs.model;
	console.log('GPT -> called checkCarAvailability function');

	if (model?.toLowerCase().includes('sedan')) {
		return JSON.stringify({ available: 15 });
	} else if (model?.toLowerCase().includes('suv')) {
		return JSON.stringify({ available: 10 });
	} else if (model?.toLowerCase().includes('truck')) {
		return JSON.stringify({ available: 5 });
	} else if (model?.toLowerCase().includes('sports')) {
		return JSON.stringify({ available: 3 });
	} else {
		return JSON.stringify({ available: 0 });
	}
}

module.exports = checkCarAvailability;
