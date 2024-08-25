'use server';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, PieChart } from '@/components/charts';
import { RecentCallLogs } from '@/components/RecentCallLogs';
import CallLogsList from '@/components/CallLogsList';
import AppointmentsList from '@/components/AppointmentsList';
import { TotalCallsCard } from '@/components/TotalCallsCard';
import { Appointment } from '@/lib/types/appointment';
import { getAppointments } from '@/lib/actions/appointments';
import { AverageDurationCard } from '@/components/AverageDurationCard';

export default async function DashboardPage() {
	const appointments: Appointment[] = (await getAppointments()).map(apt => ({
		...apt,
		_id: apt._id.toString(),
		date: apt.createdAt
			? new Date(apt.createdAt).toLocaleDateString()
			: 'Invalid Date',
		type:
			(apt.type as 'oil_change' | 'maintenance' | 'test_drive') ||
			'maintenance',
	}));
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
							<TotalCallsCard />
							<AverageDurationCard />
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
						<AppointmentsList appointments={appointments} />
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
