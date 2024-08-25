'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { getCallLogs } from '@/lib/actions/call-logs';
import { CallLog } from '@/lib/types/callLog';

export function CallLogsList() {
	const [callLogs, setCallLogs] = useState<CallLog[]>([]);

	useEffect(() => {
		async function fetchCallLogs() {
			const logs = await getCallLogs();
			setCallLogs(logs);
		}
		fetchCallLogs();
	}, []);

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Call SID</TableHead>
					<TableHead>Created At</TableHead>
					<TableHead>Ended At</TableHead>
					<TableHead>Actions</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{callLogs.map(log => (
					<TableRow key={log._id}>
						<TableCell>{log.callSid}</TableCell>
						<TableCell>{new Date(log.createdAt).toLocaleString()}</TableCell>
						<TableCell>
							{log.endedAt ? new Date(log.endedAt).toLocaleString() : 'N/A'}
						</TableCell>
						<TableCell>
							<Link href={`/dashboard/call-logs/${log._id}`}>
								<Button variant="outline">View Details</Button>
							</Link>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
