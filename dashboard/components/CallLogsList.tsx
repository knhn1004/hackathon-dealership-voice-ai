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
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function CallLogsList() {
	const callLogs: CallLog[] = await getCallLogs();

	function getCallType(toolsUsed: string[]): string {
		if (toolsUsed.includes('transferCall')) {
			return 'Transfer';
		} else if (
			toolsUsed.some(tool =>
				[
					'scheduleTestDrive',
					'scheduleCarMaintenance',
					'scheduleOilChange',
				].includes(tool)
			)
		) {
			return 'Conversion';
		} else {
			return 'Inquiry';
		}
	}

	function getCallTypeBadge(toolsUsed: string[]): JSX.Element {
		const callType = getCallType(toolsUsed);
		let variant: 'default' | 'secondary' | 'destructive' = 'default';

		switch (callType) {
			case 'Transfer':
				variant = 'secondary';
				break;
			case 'Conversion':
				variant = 'destructive';
				break;
			// "Inquiry" will use the default variant
		}

		return <Badge variant={variant}>{callType}</Badge>;
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Call Logs</CardTitle>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Call SID</TableHead>
							<TableHead>Created At</TableHead>
							<TableHead>Ended At</TableHead>
							<TableHead>Duration</TableHead>
							<TableHead>Call Type</TableHead>
							<TableHead>Tools Used</TableHead>
							<TableHead>Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{callLogs.map(log => (
							<TableRow key={log._id}>
								<TableCell>{log.callSid}</TableCell>
								<TableCell>
									{new Date(log.createdAt).toLocaleString()}
								</TableCell>
								<TableCell>
									{log.endedAt ? new Date(log.endedAt).toLocaleString() : 'N/A'}
								</TableCell>
								<TableCell>{log.duration}</TableCell>
								<TableCell>{getCallTypeBadge(log.toolsUsed)}</TableCell>
								<TableCell>{log.toolsUsed.join(', ')}</TableCell>
								<TableCell>
									<Link href={`/dashboard/call-logs/${log._id}`}>
										<Button variant="outline">View Details</Button>
									</Link>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}
