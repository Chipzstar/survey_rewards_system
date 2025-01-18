import { UserButton } from '@clerk/nextjs';
import { Button } from '~/components/ui/button';
import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';
import { HydrateClient, trpc } from '~/trpc/server';

export default async function Dashboard() {
  const user = await auth();

  if (!user.userId) {
    return (
      <div className='flex min-h-screen flex-col items-center justify-center p-24'>
        <h1 className='mb-8 text-4xl font-bold'>You are not signed in.</h1>
        <Link href='/login' className='text-primary'>
          Login
        </Link>
      </div>
    );
  }

  const surveys = await trpc.survey.all();

  return (
    <HydrateClient>
      <main className='flex min-h-screen flex-col xl:p-12 2xl:p-24'>
        <div className='mb-8 flex w-full items-center justify-between'>
          <h1 className='text-4xl font-bold'>Dashboard</h1>
          <UserButton afterSignOutUrl='/' />
        </div>
        <div className='flex flex-col items-center justify-center'>
          <p className='mb-4'>Welcome to your dashboard.</p>
          <Button asChild>
            <Link href='/create-survey'>Create new survey rewards form!</Link>
          </Button>
          <div className='mt-8'>
            <h2 className='text-2xl font-semibold'>Survey Dashboard</h2>
            <ul className='mt-2'>
              {surveys.map(survey => (
                <li>
                  <Link href={`/event/${survey.id}`} className='text-primary'>
                    {survey.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}
