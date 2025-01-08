import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";

export default async function Dashboard() {
	const user = await auth();

	if (!user.userId) {
		return (
				<div className="flex min-h-screen flex-col items-center justify-center p-24">
					<h1 className="text-4xl font-bold mb-8">
						You are not signed in.
					</h1>
					<Link href="/" className="text-primary">Go back to home</Link>
				</div>
		)
	}

	return (
			<main className="flex min-h-screen flex-col items-center p-24">
				<div className="flex w-full justify-between items-center mb-8">
					<h1 className="text-4xl font-bold">
						Dashboard
					</h1>
					<UserButton afterSignOutUrl="/"/>
				</div>
				<div className="flex flex-col items-center">
					<p className="mb-4">
						Welcome to your dashboard.
					</p>
					<Button asChild>
						<Link href="/dashboard/create-survey">Create new survey rewards form!</Link>
					</Button>
					<div className="mt-8">
						<h2>Survey Dashboard</h2>
						<ul className="mt-2">
							<li>
								<Link href="/dashboard/event/1" className="text-primary">1. The Tech Conference 2024</Link>
							</li>
							<li>
								<Link href="/dashboard/event/2" className="text-primary">2. The Tech Conference 2025</Link>
							</li>
						</ul>
					</div>
				</div>
			</main>
	);
}
