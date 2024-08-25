import { CallLogsList } from '@/components/CallLogsList';

export default function CallLogsPage() {
	return (
		<div className="container mx-auto py-10">
			<h1 className="text-3xl font-bold mb-5">Call Logs</h1>
			<CallLogsList />
		</div>
	);
}
