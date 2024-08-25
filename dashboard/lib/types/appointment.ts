export interface Appointment {
	_id: string;
	type: 'oil_change' | 'maintenance' | 'test_drive';
	model?: string;
	date: string;
	time?: string;
	customerName?: string;
	phoneNumber?: string;
	createdAt?: string;
}
