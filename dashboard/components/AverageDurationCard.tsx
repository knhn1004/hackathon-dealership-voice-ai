import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getAverageDuration } from '@/lib/actions/call-logs';

export async function AverageDurationCard() {
	const { averageDuration, percentageChange } = await getAverageDuration();

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-sm font-medium">Average Duration</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold">{averageDuration}</div>
				<p className="text-xs text-muted-foreground">
					{percentageChange >= 0 ? '+' : ''}
					{percentageChange.toFixed(1)}% from last month
				</p>
			</CardContent>
		</Card>
	);
}
