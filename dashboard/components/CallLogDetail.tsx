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
import { Badge } from '@/components/ui/badge';

export async function CallLogDetail({ id }: { id: string }) {
	const { callLog, transcriptions } = await getCallLogData(id);
	if (!callLog) {
		return <div>Loading...</div>;
	}

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
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>Call Details</CardTitle>
				</CardHeader>
				<CardContent>
					<dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
						<div className="sm:col-span-1">
							<dt className="text-sm font-medium text-gray-500">Call SID</dt>
							<dd className="mt-1 text-sm text-gray-900">{callLog.callSid}</dd>
						</div>
						<div className="sm:col-span-1">
							<dt className="text-sm font-medium text-gray-500">Stream SID</dt>
							<dd className="mt-1 text-sm text-gray-900">
								{callLog.streamSid}
							</dd>
						</div>
						<div className="sm:col-span-1">
							<dt className="text-sm font-medium text-gray-500">Created At</dt>
							<dd className="mt-1 text-sm text-gray-900">
								{new Date(callLog.createdAt).toLocaleString()}
							</dd>
						</div>
						<div className="sm:col-span-1">
							<dt className="text-sm font-medium text-gray-500">Ended At</dt>
							<dd className="mt-1 text-sm text-gray-900">
								{callLog.endedAt
									? new Date(callLog.endedAt).toLocaleString()
									: 'N/A'}
							</dd>
						</div>
						<div className="sm:col-span-1">
							<dt className="text-sm font-medium text-gray-500">Duration</dt>
							<dd className="mt-1 text-sm text-gray-900">
								{callLog.duration || 'N/A'}
							</dd>
						</div>
						<div className="sm:col-span-1">
							<dt className="text-sm font-medium text-gray-500">Call Type</dt>
							<dd className="mt-1 text-sm text-gray-900">
								{getCallTypeBadge(callLog.toolsUsed)}
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
