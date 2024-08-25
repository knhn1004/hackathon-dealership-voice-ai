'use server';
import dbService from '@/lib/db';
import { ObjectId } from 'mongodb';
import { Appointment } from '../types/appointment';

export async function getAppointments() {
	return dbService.connect().then(async () => {
		const oilChangeAppointments = await dbService.query(
			'oil_change_appointments',
			[]
		);
		const maintenanceAppointments = await dbService.query(
			'maintenance_appointments',
			[]
		);
		const testDriveAppointments = await dbService.query(
			'test_drive_appointments',
			[]
		);

		const allAppointments = [
			...oilChangeAppointments.map(a => ({
				...a,
				_id: a._id.toString(), // Convert ObjectId to string
				type: 'oil_change',
				date: a.appointmentDate,
			})),
			...maintenanceAppointments.map(a => ({
				...a,
				_id: a._id.toString(), // Convert ObjectId to string
				type: 'maintenance',
				date: a.appointmentDate,
			})),
			...testDriveAppointments.map(a => ({
				...a,
				_id: a._id.toString(), // Convert ObjectId to string
				type: 'test_drive',
				date: a.appointmentDate,
			})),
		] as Array<Appointment>;

		return allAppointments.sort(
			(a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
		);
	});
}
