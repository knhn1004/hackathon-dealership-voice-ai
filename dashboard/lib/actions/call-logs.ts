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

			const createdAt = new Date(callLog.createdAt);
			const endedAt = callLog.endedAt ? new Date(callLog.endedAt) : new Date();
			const durationMs = endedAt.getTime() - createdAt.getTime();
			const durationMinutes = Math.floor(durationMs / 60000);
			const durationSeconds = Math.floor((durationMs % 60000) / 1000);
			callLog.duration = `${durationMinutes}m ${durationSeconds}s`;

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
		return logs.map(log => {
			const createdAt = new Date(log.createdAt);
			const endedAt = log.endedAt ? new Date(log.endedAt) : new Date();
			const durationMs = endedAt.getTime() - createdAt.getTime();
			const durationMinutes = Math.floor(durationMs / 60000);
			const durationSeconds = Math.floor((durationMs % 60000) / 1000);

			return {
				_id: log._id.toString(),
				callSid: log.callSid,
				streamSid: log.streamSid,
				createdAt: log.createdAt,
				endedAt: log.endedAt,
				toolsUsed: log.toolsUsed || [],
				duration: `${durationMinutes}m ${durationSeconds}s`,
			};
		});
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

export async function getTotalCalls(): Promise<{
	total: number;
	percentageChange: number;
}> {
	return withDbConnection(async () => {
		const currentMonth = moment().startOf('month');
		const lastMonth = moment().subtract(1, 'month').startOf('month');

		const currentMonthCalls = await dbService
			.getDb()
			.collection('call_logs')
			.countDocuments({
				createdAt: { $gte: currentMonth.toDate() },
			});

		const lastMonthCalls = await dbService
			.getDb()
			.collection('call_logs')
			.countDocuments({
				createdAt: { $gte: lastMonth.toDate(), $lt: currentMonth.toDate() },
			});

		const percentageChange =
			lastMonthCalls > 0
				? ((currentMonthCalls - lastMonthCalls) / lastMonthCalls) * 100
				: 0;

		return {
			total: currentMonthCalls,
			percentageChange,
		};
	});
}

export async function getAverageDuration(): Promise<{
	averageDuration: string;
	percentageChange: number;
}> {
	return withDbConnection(async () => {
		const currentMonth = moment().startOf('month');
		const lastMonth = moment().subtract(1, 'month').startOf('month');

		const [currentMonthCalls, lastMonthCalls] = await Promise.all([
			dbService
				.getDb()
				.collection('call_logs')
				.find({ createdAt: { $gte: currentMonth.toDate() } })
				.toArray(),
			dbService
				.getDb()
				.collection('call_logs')
				.find({
					createdAt: { $gte: lastMonth.toDate(), $lt: currentMonth.toDate() },
				})
				.toArray(),
		]);

		const calculateAverageDuration = (calls: any[]) => {
			const totalDuration = calls.reduce((sum, call) => {
				const start = new Date(call.createdAt);
				const end = call.endedAt ? new Date(call.endedAt) : new Date();
				return sum + (end.getTime() - start.getTime());
			}, 0);
			return calls.length > 0 ? totalDuration / calls.length : 0;
		};

		const currentAvg = calculateAverageDuration(currentMonthCalls);
		const lastAvg = calculateAverageDuration(lastMonthCalls);

		const percentageChange =
			lastAvg > 0 ? ((currentAvg - lastAvg) / lastAvg) * 100 : 0;

		const minutes = Math.floor(currentAvg / 60000);
		const seconds = Math.floor((currentAvg % 60000) / 1000);

		return {
			averageDuration: `${minutes}m ${seconds}s`,
			percentageChange,
		};
	});
}
