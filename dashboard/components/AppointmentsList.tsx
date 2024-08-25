'use client';

import { useEffect, useState } from 'react';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getAppointments } from '@/lib/actions/appointments';
import { Appointment } from '@/lib/types/appointment';

export default function AppointmentsList() {
	const [appointments, setAppointments] = useState<Appointment[]>([]);

	useEffect(() => {
		async function fetchAppointments() {
			const fetchedAppointments = await getAppointments();
			setAppointments(
				fetchedAppointments.map(apt => ({
					...apt,
					_id: apt._id.toString(),
					date: apt.createdAt
						? new Date(apt.createdAt).toLocaleDateString()
						: 'Invalid Date',
					type:
						(apt.type as 'oil_change' | 'maintenance' | 'test_drive') ||
						'maintenance',
				}))
			);
		}
		fetchAppointments();
	}, []);

	return (
		<Card>
			<CardHeader>
				<CardTitle>Appointments</CardTitle>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Type</TableHead>
							<TableHead>Model</TableHead>
							<TableHead>Date</TableHead>
							<TableHead>Time</TableHead>
							<TableHead>Customer Name</TableHead>
							<TableHead>Phone Number</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{appointments.map(appointment => (
							<TableRow key={appointment._id}>
								<TableCell>{appointment.type.replace('_', ' ')}</TableCell>
								<TableCell>{appointment.model}</TableCell>
								<TableCell>{appointment.date}</TableCell>
								<TableCell>{appointment.time}</TableCell>
								<TableCell>{appointment.customerName}</TableCell>
								<TableCell>{appointment.phoneNumber}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}
