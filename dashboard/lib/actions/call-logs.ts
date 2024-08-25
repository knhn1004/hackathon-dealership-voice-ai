'use server';

import dbService from '@/lib/db';
import { CallLog, Transcription } from '@/lib/types/callLog';

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
			_id: log._id.toString(), // Convert ObjectId to string
			callSid: log.callSid,
			streamSid: log.streamSid,
			createdAt: log.createdAt,
			endedAt: log.endedAt,
		}));
	});
}
