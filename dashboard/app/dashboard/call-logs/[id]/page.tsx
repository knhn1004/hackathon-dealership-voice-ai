import { CallLogDetail } from '@/components/CallLogDetail';

export default function CallLogDetailPage({
	params,
}: {
	params: { id: string };
}) {
	return (
		<div className="container mx-auto py-10">
			<h1 className="text-3xl font-bold mb-5">Call Log Details</h1>
			<CallLogDetail id={params.id} />
		</div>
	);
}
