'use client';

import { Bar, Pie } from 'react-chartjs-2';
import {
	Chart as ChartJS,
	ArcElement,
	Tooltip,
	Legend,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
} from 'chart.js';

ChartJS.register(
	ArcElement,
	Tooltip,
	Legend,
	CategoryScale,
	LinearScale,
	BarElement,
	Title
);

export function BarChart() {
	const data = {
		labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
		datasets: [
			{
				label: 'Calls',
				data: [65, 59, 80, 81, 56, 55, 40],
				backgroundColor: 'rgba(75, 192, 192, 0.6)',
			},
		],
	};

	const options = {
		responsive: true,
		maintainAspectRatio: false,
	};

	return <Bar data={data} options={options} width={200} height={150} />;
}

export function PieChart() {
	const data = {
		labels: ['Inbound', 'Outbound', 'Missed'],
		datasets: [
			{
				data: [300, 50, 100],
				backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
				hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
			},
		],
	};

	const options = {
		responsive: true,
		maintainAspectRatio: false,
	};

	return <Pie data={data} options={options} width={200} height={150} />;
}
