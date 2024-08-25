import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
	CardFooter,
} from '@/components/ui/card';

export default function Home() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gradient-to-b from-blue-50 to-white">
			<Card className="w-full max-w-2xl shadow-lg">
				<CardHeader>
					<CardTitle className="text-4xl font-bold text-center">
						AI Car Dealership Voice Agent 🚗
					</CardTitle>
					<CardDescription className="text-xl text-center mt-2">
						Revolutionize Your Customer Interactions
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4 text-center">
					<p className="text-gray-700">
						Harness the power of AI to enhance your customer support:
					</p>
					<ul className="list-disc list-inside text-left text-gray-600">
						<li>Automated call transcription and summarization</li>
						<li>Sentiment analysis for customer feedback</li>
						<li>AI-powered insights and recommendations</li>
						<li>Seamless integration with your existing systems</li>
						<li>Real-time audio streaming and processing</li>
						<li>Appointment scheduling and management</li>
					</ul>
					<p className="text-gray-700 mt-4">
						Built with cutting-edge technologies:
					</p>
					<p className="text-gray-600">
						Next.js 14, React, TypeScript, Tailwind CSS, Chart.js, and MongoDB
					</p>
				</CardContent>
				<CardFooter className="flex justify-center space-x-4">
					<Link href="/dashboard">
						<Button size="lg" variant="default">
							Explore Dashboard
						</Button>
					</Link>
					<Link href="/#docs">
						<Button size="lg" variant="outline">
							View Documentation
						</Button>
					</Link>
				</CardFooter>
			</Card>
		</main>
	);
}
