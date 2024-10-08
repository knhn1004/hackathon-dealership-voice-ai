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

export async function RecentCallLogs() {
	const callLogs: CallLog[] = (await getCallLogs()).slice(0, 5);

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
		<>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Call SID</TableHead>
						<TableHead>Created At</TableHead>
						<TableHead>Ended At</TableHead>
						<TableHead>Duration</TableHead>
						<TableHead>Call Type</TableHead>
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
							<TableCell>{log.duration}</TableCell>
							<TableCell>{getCallTypeBadge(log.toolsUsed)}</TableCell>
							<TableCell>
								<Link href={`/dashboard/call-logs/${log._id}`}>
									<Button variant="outline">View Details</Button>
								</Link>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</>
	);
}
