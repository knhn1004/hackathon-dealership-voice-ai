'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { getCallLogData } from '@/lib/actions/call-logs';
import { CallLog, Transcription } from '@/lib/types/callLog';

export function CallLogDetail({ id }: { id: string }) {
	const [callLog, setCallLog] = useState<CallLog | null>(null);
	const [transcriptions, setTranscriptions] = useState<Transcription[]>([]);

	useEffect(() => {
		async function fetchCallLogData() {
			const { callLog, transcriptions } = await getCallLogData(id);
			if (callLog) {
				setCallLog(callLog);
				setTranscriptions(transcriptions);
			}
		}
		fetchCallLogData();
	}, [id]);

	if (!callLog) {
		return <div>Loading...</div>;
	}

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>Call Information</CardTitle>
				</CardHeader>
				<CardContent>
					<dl className="grid grid-cols-2 gap-4">
						<div>
							<dt className="font-semibold">Call SID</dt>
							<dd>{callLog.callSid}</dd>
						</div>
						<div>
							<dt className="font-semibold">Stream SID</dt>
							<dd>{callLog.streamSid}</dd>
						</div>
						<div>
							<dt className="font-semibold">Created At</dt>
							<dd>{new Date(callLog.createdAt).toLocaleString()}</dd>
						</div>
						<div>
							<dt className="font-semibold">Ended At</dt>
							<dd>
								{callLog.endedAt
									? new Date(callLog.endedAt).toLocaleString()
									: 'N/A'}
							</dd>
						</div>
					</dl>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Tools Used</CardTitle>
				</CardHeader>
				<CardContent>
					<ul className="list-disc pl-6">
						{callLog.toolsUsed?.map((tool, index) => (
							<li key={index}>{tool}</li>
						))}
					</ul>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Transcriptions</CardTitle>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Role</TableHead>
								<TableHead>Content</TableHead>
								<TableHead>Timestamp</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{transcriptions.map(trans => (
								<TableRow key={trans._id}>
									<TableCell>{trans.role}</TableCell>
									<TableCell>{trans.content}</TableCell>
									<TableCell>
										{new Date(trans.timestamp).toLocaleString()}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>

			{callLog.fullTranscript && (
				<Card>
					<CardHeader>
						<CardTitle>Full Transcript</CardTitle>
					</CardHeader>
					<CardContent>
						<pre className="whitespace-pre-wrap">{callLog.fullTranscript}</pre>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
