const moment = require('moment');

function getCurrentDateTime() {
	return moment().format('YYYY-MM-DD HH:mm:ss');
}

function getRelativeDate(relativeDay) {
	const daysOfWeek = [
		'sunday',
		'monday',
		'tuesday',
		'wednesday',
		'thursday',
		'friday',
		'saturday',
	];
	const today = moment();
	const dayIndex = daysOfWeek.indexOf(relativeDay.toLowerCase());

	if (dayIndex === -1) {
		throw new Error('Invalid day of the week');
	}

	let targetDate = today.day(dayIndex);
	if (targetDate.isBefore(today)) {
		targetDate.add(1, 'week');
	}

	return targetDate.format('YYYY-MM-DD');
}

function parseRelativeDateTime(input) {
	const parts = input.toLowerCase().split(' ');
	let date, time;

	if (parts.includes('this')) {
		const dayIndex = parts.findIndex(part =>
			[
				'monday',
				'tuesday',
				'wednesday',
				'thursday',
				'friday',
				'saturday',
				'sunday',
			].includes(part)
		);
		if (dayIndex !== -1) {
			date = getRelativeDate(parts[dayIndex]);
		}
	}

	const timeIndex = parts.findIndex(
		part => part.includes(':') || ['am', 'pm'].includes(part)
	);
	if (timeIndex !== -1) {
		time = moment(parts.slice(timeIndex).join(' '), ['h:mm a', 'H:mm']).format(
			'HH:mm'
		);
	}

	return { date, time };
}

module.exports = {
	getCurrentDateTime,
	getRelativeDate,
	parseRelativeDateTime,
};
