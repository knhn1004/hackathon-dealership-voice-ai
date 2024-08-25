import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Appointment } from '@/lib/types/appointment';

interface IAppointmentsList {
	appointments: Appointment[];
}

export default function AppointmentsList({ appointments }: IAppointmentsList) {
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
