import { CallLogDetail } from '@/components/CallLogDetail';
import { BreadcrumbNav } from '@/components/BreadCrumb';

export default function CallLogDetailPage({
	params,
}: {
	params: { id: string };
}) {
	const breadcrumbItems = [
		{ label: 'Dashboard', href: '/dashboard' },
		{
			label: `${params.id}`,
			href: `/dashboard/call-logs/${params.id}`,
			active: true,
		},
	];
	return (
		<div className="container mx-auto py-10">
			<BreadcrumbNav items={breadcrumbItems} />
			<h1 className="text-3xl font-bold mb-5">Call Log Details</h1>
			<CallLogDetail id={params.id} />
		</div>
	);
}
