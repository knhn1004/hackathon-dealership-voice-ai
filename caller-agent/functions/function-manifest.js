// create metadata for all the available functions to pass to completions API
const tools = [
	{
		type: 'function',
		function: {
			name: 'checkCarAvailability',
			say: 'Let me check our inventory for that car model.',
			description: 'Check the availability of a specific car model.',
			parameters: {
				type: 'object',
				properties: {
					model: {
						type: 'string',
						enum: ['sedan', 'suv', 'truck', 'sports'],
						description: 'The type of car model',
					},
				},
				required: ['model'],
			},
			returns: {
				type: 'object',
				properties: {
					available: {
						type: 'integer',
						description:
							'The number of cars available for the specified model.',
					},
				},
			},
		},
	},
	{
		type: 'function',
		function: {
			name: 'getCarPrice',
			say: `I'll check the price for that car model.`,
			description: 'Get the price of a specific car model.',
			parameters: {
				type: 'object',
				properties: {
					model: {
						type: 'string',
						enum: ['sedan', 'suv', 'truck', 'sports'],
						description: 'The type of car model',
					},
				},
				required: ['model'],
			},
			returns: {
				type: 'object',
				properties: {
					price: {
						type: 'integer',
						description: 'The price of the specified car model.',
					},
				},
			},
		},
	},
	{
		type: 'function',
		function: {
			name: 'scheduleTestDrive',
			say: "Great! I'll schedule a test drive for you.",
			description: 'Schedule a test drive for a customer.',
			parameters: {
				type: 'object',
				properties: {
					model: {
						type: 'string',
						enum: ['sedan', 'suv', 'truck', 'sports'],
						description: 'The type of car model',
					},
					date: {
						type: 'string',
						description:
							'The date for the test drive (YYYY-MM-DD format or relative date like "this Saturday")',
					},
					time: {
						type: 'string',
						description: 'The time for the test drive (HH:MM format)',
					},
					customerName: {
						type: 'string',
						description: "The customer's full name",
					},
					phoneNumber: {
						type: 'string',
						description: "The customer's phone number",
					},
				},
				required: ['model', 'date', 'time', 'customerName', 'phoneNumber'],
			},
			returns: {
				type: 'object',
				properties: {
					confirmation: {
						type: 'string',
						description: 'A confirmation message for the scheduled test drive.',
					},
				},
			},
		},
	},
	{
		type: 'function',
		function: {
			name: 'checkMaintenanceSchedule',
			say: "I'll check the maintenance schedule for your car.",
			description: 'Check the maintenance schedule for a specific car model.',
			parameters: {
				type: 'object',
				properties: {
					model: {
						type: 'string',
						enum: ['sedan', 'suv', 'truck', 'sports'],
						description: 'The type of car model',
					},
					mileage: {
						type: 'integer',
						description: 'The current mileage of the car',
					},
				},
				required: ['model', 'mileage'],
			},
			returns: {
				type: 'object',
				properties: {
					nextService: {
						type: 'string',
						description: 'Description of the next recommended service',
					},
					mileageUntilService: {
						type: 'integer',
						description: 'Number of miles until the next service is due',
					},
				},
			},
		},
	},
	{
		type: 'function',
		function: {
			name: 'scheduleCarMaintenance',
			say: "I'll schedule a maintenance appointment for your car.",
			description: 'Schedule a car maintenance appointment.',
			parameters: {
				type: 'object',
				properties: {
					model: {
						type: 'string',
						enum: ['sedan', 'suv', 'truck', 'sports'],
						description: 'The type of car model',
					},
					date: {
						type: 'string',
						description:
							'The date for the maintenance/oil change (YYYY-MM-DD format or relative date like "this Saturday")',
					},
					time: {
						type: 'string',
						description: 'The time for the maintenance (HH:MM format)',
					},
					serviceType: {
						type: 'string',
						description: 'The type of service needed',
					},
					customerName: {
						type: 'string',
						description: "The customer's full name",
					},
					phoneNumber: {
						type: 'string',
						description: "The customer's phone number",
					},
				},
				required: [
					'model',
					'date',
					'time',
					'serviceType',
					'customerName',
					'phoneNumber',
				],
			},
			returns: {
				type: 'object',
				properties: {
					confirmation: {
						type: 'string',
						description:
							'A confirmation message for the scheduled maintenance.',
					},
				},
			},
		},
	},
	{
		type: 'function',
		function: {
			name: 'scheduleOilChange',
			say: "I'll schedule an oil change for your car.",
			description: 'Schedule an oil change appointment.',
			parameters: {
				type: 'object',
				properties: {
					model: {
						type: 'string',
						enum: ['sedan', 'suv', 'truck', 'sports'],
						description: 'The type of car model',
					},
					date: {
						type: 'string',
						description:
							'The date for the maintenance/oil change (YYYY-MM-DD format or relative date like "this Saturday")',
					},
					time: {
						type: 'string',
						description: 'The time for the oil change (HH:MM format)',
					},
					customerName: {
						type: 'string',
						description: "The customer's full name",
					},
					phoneNumber: {
						type: 'string',
						description: "The customer's phone number",
					},
				},
				required: ['model', 'date', 'time', 'customerName', 'phoneNumber'],
			},
			returns: {
				type: 'object',
				properties: {
					confirmation: {
						type: 'string',
						description: 'A confirmation message for the scheduled oil change.',
					},
				},
			},
		},
	},
	{
		type: 'function',
		function: {
			name: 'transferCall',
			say: 'One moment while I transfer your call.',
			description:
				'Transfers the customer to a live agent in case they request help from a real person.',
			parameters: {
				type: 'object',
				properties: {
					callSid: {
						type: 'string',
						description: 'The unique identifier for the active phone call.',
					},
				},
				required: ['callSid'],
			},
		},
	},
];

module.exports = tools;
