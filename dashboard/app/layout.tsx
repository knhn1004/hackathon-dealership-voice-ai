import type { Metadata } from 'next';
import './globals.css';
import { Space_Grotesk as FontSans } from 'next/font/google';
import { cn } from '@/lib/utils';

const fontSans = FontSans({
	subsets: ['latin'],
	variable: '--font-sans',
});

export const metadata: Metadata = {
	title: 'Dealership Dashboard',
	description: 'Dashboard for the dealership AI voice assistant',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={cn(
					'min-h-screen bg-background font-sans antialiased',
					fontSans.variable
				)}
				suppressHydrationWarning
			>
				{children}
			</body>
		</html>
	);
}
