import { CallLogsList } from '@/components/CallLogsList';
import { BreadcrumbNav } from '@/components/Breadcrumb';

export default function CallLogsPage() {
	const breadcrumbItems = [
		{ label: 'Dashboard', href: '/dashboard' },
		{ label: 'Call Logs', href: '/dashboard/call-logs' },
	];

	return (
		<div className="container mx-auto py-10">
			<BreadcrumbNav items={breadcrumbItems} />
			<h1 className="text-3xl font-bold mb-5">Call Logs</h1>
			<CallLogsList />
		</div>
	);
}
