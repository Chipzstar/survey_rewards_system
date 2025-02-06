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
      <main className='flex min-h-screen flex-col p-6 xl:p-12 2xl:p-24'>
        <div className='mb-8 flex w-full items-center justify-between'>
          <h1 className='text-4xl font-bold'>Dashboard</h1>
          <UserButton afterSignOutUrl='/' />
        </div>
        <div className='flex flex-col items-center justify-center'>
          <div className='mt-8'>
            <h2 className='text-2xl font-semibold'>Survey Dashboard</h2>
            <ul className='mt-6 flex flex-col gap-y-4'>
              {surveys.map(survey => (
                <li key={survey.id}>
                  <Link
                    href={`/survey/${survey.id}`}
                    className='block rounded-md border border-gray-200 bg-white p-4 shadow-sm transition-colors hover:border-primary hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-primary'
                  >
                    <div className='flex items-center justify-between'>
                      <span className='text-lg font-medium text-gray-800 dark:text-gray-100'>{survey.name}</span>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 20 20'
                        fill='currentColor'
                        className='h-5 w-5 text-gray-500 dark:text-gray-400'
                      >
                        <path
                          fillRule='evenodd'
                          d='M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z'
                          clipRule='evenodd'
                        />
                      </svg>
                    </div>
                    <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>{survey.description}</p>
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
