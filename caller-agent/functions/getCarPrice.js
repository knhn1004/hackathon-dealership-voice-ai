async function getCarPrice(functionArgs) {
	const model = functionArgs.model;
	console.log('GPT -> called getCarPrice function');

	if (model?.toLowerCase().includes('sedan')) {
		return JSON.stringify({ price: 25000 });
	} else if (model?.toLowerCase().includes('suv')) {
		return JSON.stringify({ price: 35000 });
	} else if (model?.toLowerCase().includes('truck')) {
		return JSON.stringify({ price: 40000 });
	} else if (model?.toLowerCase().includes('sports')) {
		return JSON.stringify({ price: 50000 });
	} else {
		return JSON.stringify({ price: 0 });
	}
}

module.exports = getCarPrice;
