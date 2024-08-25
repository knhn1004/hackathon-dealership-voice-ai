'use client';

import React, { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
	ArcElement,
} from 'chart.js';
import { getCallVolume, getCallLogs } from '@/lib/actions/call-logs';
import moment from 'moment';

// Register ChartJS components
ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
	ArcElement
);

export function BarChart() {
	const [callVolume, setCallVolume] = React.useState<
		{ date: string; count: number }[]
	>([]);

	useEffect(() => {
		async function fetchCallVolume() {
			const volume = await getCallVolume();
			setCallVolume(volume);
		}
		fetchCallVolume();
	}, []);

	const data = {
		labels: callVolume.map(item => moment(item.date).format('MMM DD')),
		datasets: [
			{
				label: 'Call Volume',
				data: callVolume.map(item => item.count),
				backgroundColor: 'rgba(75, 192, 192, 0.6)',
				borderColor: 'rgba(75, 192, 192, 1)',
				borderWidth: 1,
				barThickness: 30,
				maxBarThickness: 50,
			},
		],
	};

	const options = {
		responsive: true,
		maintainAspectRatio: false,
		scales: {
			y: {
				beginAtZero: true,
				title: {
					display: true,
					text: 'Number of Calls',
					fontSize: 18,
				},
			},
			x: {
				title: {
					display: true,
					text: 'Date',
					fontSize: 18,
				},
			},
		},
		plugins: {
			tooltip: {
				callbacks: {
					title: (context: any) => {
						return moment(callVolume[context[0].dataIndex].date).format(
							'MMMM D, YYYY'
						);
					},
				},
			},
		},
	};

	return (
		<div style={{ width: '100%', height: '300px' }}>
			<Bar data={data} options={options} />
		</div>
	);
}

export function PieChart() {
	const [callTypes, setCallTypes] = useState<{ [key: string]: number }>({});

	useEffect(() => {
		async function fetchCallTypes() {
			const logs = await getCallLogs();
			const types = logs.reduce((acc, log) => {
				if (log.toolsUsed?.includes('transferCall')) {
					acc.Transfer = (acc.Transfer || 0) + 1;
				} else if (
					log.toolsUsed?.some(tool =>
						[
							'scheduleTestDrive',
							'scheduleCarMaintenance',
							'scheduleOilChange',
						].includes(tool)
					)
				) {
					acc.Conversion = (acc.Conversion || 0) + 1;
				} else {
					acc.Inquiry = (acc.Inquiry || 0) + 1;
				}
				return acc;
			}, {} as { [key: string]: number });
			setCallTypes(types);
		}
		fetchCallTypes();
	}, []);

	const data = {
		labels: Object.keys(callTypes),
		datasets: [
			{
				data: Object.values(callTypes),
				backgroundColor: ['#36A2EB', '#FFCE56', '#FF6384'],
				hoverBackgroundColor: ['#36A2EB', '#FFCE56', '#FF6384'],
			},
		],
	};

	const options = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				position: 'bottom' as const,
			},
			title: {
				display: true,
				text: 'Call Types',
				font: {
					size: 16,
				},
			},
		},
	};

	return (
		<div style={{ width: '100%', height: '300px' }}>
			<Pie data={data} options={options} />
		</div>
	);
}
