'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, PieChart } from '@/components/charts';
import { RecentCallLogs } from '@/components/RecentCallLogs';
import CallLogsList from '@/components/CallLogsList';
import AppointmentsList from '@/components/AppointmentsList';

export default function DashboardPage() {
	return (
		<div className="flex-col md:flex">
			<div className="flex-1 space-y-4 p-8 pt-6">
				<div className="flex items-center justify-between space-y-2">
					<h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
				</div>
				<Tabs defaultValue="overview" className="space-y-4">
					<TabsList>
						<TabsTrigger value="overview">Overview</TabsTrigger>
						<TabsTrigger value="call-logs">Call Logs</TabsTrigger>
						<TabsTrigger value="appointments">Appointments</TabsTrigger>
					</TabsList>
					<TabsContent value="overview" className="space-y-4">
						<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
							<Card>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium">
										Total Calls
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">1,234</div>
									<p className="text-xs text-muted-foreground">
										+20.1% from last month
									</p>
								</CardContent>
							</Card>
							<Card>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium">
										Average Duration
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">5m 23s</div>
									<p className="text-xs text-muted-foreground">
										-2.5% from last month
									</p>
								</CardContent>
							</Card>
							{/* Add more cards for other metrics */}
						</div>
						<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
							<Card className="col-span-4">
								<CardHeader>
									<CardTitle>Call Volume</CardTitle>
								</CardHeader>
								<CardContent className="pl-2">
									<BarChart />
								</CardContent>
							</Card>
							<Card className="col-span-3">
								<CardHeader>
									<CardTitle>Call Types</CardTitle>
								</CardHeader>
								<CardContent>
									<PieChart />
								</CardContent>
							</Card>
						</div>
						<Card>
							<CardHeader>
								<CardTitle>Recent Call Logs</CardTitle>
							</CardHeader>
							<CardContent>
								<RecentCallLogs />
							</CardContent>
						</Card>
					</TabsContent>
					<TabsContent value="call-logs">
						<CallLogsList />
					</TabsContent>
					<TabsContent value="appointments">
						<AppointmentsList />
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
