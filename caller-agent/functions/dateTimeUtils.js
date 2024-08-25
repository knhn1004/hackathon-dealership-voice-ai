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
	const [prefix, day] = relativeDay.toLowerCase().split(' ');
	const dayIndex = daysOfWeek.indexOf(day || prefix);

	if (dayIndex === -1) {
		throw new Error('Invalid day of the week');
	}

	let targetDate = today.day(dayIndex);

	if (
		prefix === 'next' ||
		(prefix !== 'this' && targetDate.isSameOrBefore(today))
	) {
		targetDate.add(1, 'week');
	}

	return targetDate.format('YYYY-MM-DD');
}

function parseRelativeDateTime(input) {
	const parts = input.toLowerCase().split(' ');
	let date, time;

	// Check for relative date expressions
	const relativeDateKeywords = [
		'today',
		'tomorrow',
		'yesterday',
		'this',
		'next',
	];
	const relativeIndex = parts.findIndex(part =>
		relativeDateKeywords.includes(part)
	);

	if (relativeIndex !== -1) {
		if (parts[relativeIndex] === 'today') {
			date = moment().format('YYYY-MM-DD');
		} else if (parts[relativeIndex] === 'tomorrow') {
			date = moment().add(1, 'day').format('YYYY-MM-DD');
		} else if (parts[relativeIndex] === 'yesterday') {
			date = moment().subtract(1, 'day').format('YYYY-MM-DD');
		} else {
			// Handle 'this' and 'next' cases
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
				date = getRelativeDate(`${parts[relativeIndex]} ${parts[dayIndex]}`);
			}
		}
	} else {
		// Try parsing as YYYY-MM-DD format
		const dateMatch = input.match(/\d{4}-\d{2}-\d{2}/);
		if (dateMatch) {
			date = dateMatch[0];
		}
	}

	// Parse time
	const timeIndex = parts.findIndex(
		part =>
			part.includes(':') || ['am', 'pm'].some(suffix => part.endsWith(suffix))
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
