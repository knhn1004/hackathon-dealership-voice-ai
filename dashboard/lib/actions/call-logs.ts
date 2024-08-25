'use server';

import dbService from '@/lib/db';
import { CallLog, Transcription } from '@/lib/types/callLog';
import moment from 'moment-timezone';

async function withDbConnection<T>(operation: () => Promise<T>): Promise<T> {
	await dbService.connect();
	try {
		return await operation();
	} finally {
		// Optionally, you can close the connection here if needed
		// await dbService.close();
	}
}

export async function getCallLogData(
	id: string
): Promise<{ callLog: CallLog | null; transcriptions: Transcription[] }> {
	return withDbConnection(async () => {
		const log = await dbService.read('call_logs', id);

		if (log && 'callSid' in log && 'streamSid' in log && 'createdAt' in log) {
			const callLog = log as unknown as CallLog;

			const trans = await dbService.query('transcriptions', [
				{ field: 'callSid', operator: '==', value: callLog.callSid },
			]);

			const transcriptions = trans as unknown as Transcription[];

			return { callLog, transcriptions };
		} else {
			console.error('Invalid log data:', log);
			return { callLog: null, transcriptions: [] };
		}
	});
}

export async function getCallLogs(): Promise<CallLog[]> {
	return withDbConnection(async () => {
		const logs = await dbService.query('call_logs', []);
		return logs.map(log => ({
			_id: log._id.toString(),
			callSid: log.callSid,
			streamSid: log.streamSid,
			createdAt: log.createdAt,
			endedAt: log.endedAt,
			toolsUsed: log.toolsUsed || [],
		}));
	});
}

export async function getCallVolume(): Promise<
	{ date: string; count: number }[]
> {
	return withDbConnection(async () => {
		const timezone =
			Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/Los_Angeles';
		const endDate = moment().tz(timezone).startOf('day').add(1, 'day');
		const startDate = moment(endDate).subtract(6, 'days');

		const aggregationResult = await dbService
			.getDb()
			.collection('call_logs')
			.aggregate<{ date: string; count: number }>([
				{
					$match: {
						createdAt: { $gte: startDate.toDate(), $lte: endDate.toDate() },
					},
				},
				{
					$group: {
						_id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
						count: { $sum: 1 },
					},
				},
				{ $sort: { _id: 1 } },
				{ $project: { _id: 0, date: '$_id', count: 1 } },
			])
			.toArray();

		// Generate an array of the last 7 days
		const last7Days = Array.from({ length: 7 }, (_, i) => {
			return {
				date: moment(startDate).add(i, 'days').format('YYYY-MM-DD'),
				count: 0,
			};
		});

		// Merge the aggregation result with the last 7 days
		const mergedResult = last7Days.map(day => {
			const dbDay = aggregationResult.find(r => r.date === day.date);
			return dbDay || day;
		});

		return mergedResult;
	});
}

function getDb() {
	throw new Error('Function not implemented.');
}
