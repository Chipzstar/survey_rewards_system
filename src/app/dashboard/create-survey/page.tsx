import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CreateSurveyPage() {
	return (
			<main
					className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24 bg-gradient-to-br from-primary to-secondary text-white">
				<h1 className="text-3xl md:text-4xl font-bold mb-4 md:mb-8">
					Create Survey Rewards Form
				</h1>
				<div className="flex flex-col items-center">
					<p className="mb-2 md:mb-4 text-lg">
						Fill out the form to create a new survey.
					</p>
					<div className="mb-2 md:mb-4">
						<label htmlFor="eventName" className="block text-sm font-medium text-white">
							Write out event name...
						</label>
						<input
								type="text"
								id="eventName"
								className="mt-1 p-2 border rounded-md w-64 text-black"
								placeholder="Event Name"
						/>
					</div>
					<p className="mb-2 md:mb-4 text-lg">
						Fill out our survey & win £[Amount] Gift Cards!
					</p>
					<p className="mb-2 md:mb-4 text-lg">
						Complete form & nudge your event connections to get DOUBLE points for each completed survey
					</p>
					<div className="mb-2 md:mb-4">
						<label htmlFor="organizerName" className="block text-sm font-medium text-white">
							Write name(s) here
						</label>
						<input
								type="text"
								id="organizerName"
								className="mt-1 p-2 border rounded-md w-64 text-black"
								placeholder="Organizer Name(s)"
						/>
					</div>
					<Button asChild>
						<Link href="/dashboard">You ready? Click to begin</Link>
					</Button>
				</div>
			</main>
	);
}
