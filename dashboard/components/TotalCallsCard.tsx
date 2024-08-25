'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getTotalCalls } from '@/lib/actions/call-logs';

export function TotalCallsCard() {
	const [totalCalls, setTotalCalls] = useState<number>(0);
	const [percentageChange, setPercentageChange] = useState<number>(0);

	useEffect(() => {
		async function fetchTotalCalls() {
			const { total, percentageChange } = await getTotalCalls();
			setTotalCalls(total);
			setPercentageChange(percentageChange);
		}
		fetchTotalCalls();
	}, []);

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-sm font-medium">Total Calls</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold">{totalCalls}</div>
				<p className="text-xs text-muted-foreground">
					{percentageChange >= 0 ? '+' : ''}
					{percentageChange.toFixed(1)}% from last month
				</p>
			</CardContent>
		</Card>
	);
}
