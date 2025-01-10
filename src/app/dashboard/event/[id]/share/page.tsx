import Link from "next/link";
import QRCode from 'react-qr-code';

export default function EventSharePage({ params }: { params: { id: string } }) {
	const { id } = params;
	const surveyLink = `https://${}/survey/${id}`;

	return (
			<main className="flex min-h-screen flex-col items-center p-4 md:p-24 bg-gradient-to-br from-primary to-secondary text-white">
				<div className="flex w-full justify-between items-center mb-4 md:mb-8">
					<h1 className="text-3xl md:text-4xl font-bold">
						Event Analytics Dashboard: Fintech Conference Survey
					</h1>
					<Link href={`/dashboard/event/${id}`} className="text-white underline">Back to Analytics</Link>
					<Link href="/dashboard" className="text-white underline">Home</Link>
				</div>
				<div className="flex flex-col items-center">
					<div className="mb-4 md:mb-8">
						<QRCode value={surveyLink} size={256} level="H" fgColor="#ffffff" />
					</div>
					<div className="flex flex-col items-center">
						<h2 className="text-2xl font-bold mb-4">Link</h2>
						<a href={surveyLink} className="text-white underline break-words">{surveyLink}</a>
					</div>
				</div>
			</main>
	);
}
