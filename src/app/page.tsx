import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
	return (
			<main
					className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24 bg-gradient-to-br from-primary to-secondary text-white">
				<h1 className="text-3xl md:text-4xl font-bold mb-4 md:mb-8">
					Welcome to the Survey Rewards System
				</h1>
				<SignedIn>
					<p className="mb-2 md:mb-4 text-lg">
						You are signed in. Go to your <Link href="/dashboard" className="text-white underline">dashboard</Link>.
					</p>
				</SignedIn>
				<SignedOut>
					<p className="mb-2 md:mb-4 text-lg">
						Please sign in to access the dashboard.
					</p>
					<SignInButton>
						<Button>Sign In</Button>
					</SignInButton>
				</SignedOut>
			</main>
	);
}
