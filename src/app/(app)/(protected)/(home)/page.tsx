import Link from 'next/link';
import { currentUser } from '@clerk/nextjs/server';
import { HydrateClient, trpc } from '~/trpc/server';
import { format } from 'date-fns';
import { ScrollArea } from '~/components/ui/scroll-area';
import { prettyPrint } from '~/lib/utils';
import { DashboardHeader } from '~/components/layout/nav-header';

export default async function Dashboard() {
  const user = await currentUser();
  prettyPrint(user);

  if (!user) {
    return (
      <div className='flex min-h-screen flex-col items-center justify-center p-24'>
        <h1 className='mb-8 text-4xl font-bold'>You are not signed in.</h1>
        <Link href='/login' className='text-primary'>
          Login
        </Link>
      </div>
    );
  }

  const [surveys, events] = await Promise.all([trpc.survey.fromUser(), trpc.event.fromUser()]);

  return (
    <HydrateClient>
      <main className='flex min-h-screen grow flex-col p-6 sm:h-screen xl:p-12 2xl:p-24'>
        <DashboardHeader userId={user.id} firstname={user.firstName} />
        <div className='grid h-full grid-cols-1 gap-y-8 lg:divide-x-2 lg:divide-gray-200'>
          {/* Events Section */}
          <section className='flex flex-col space-y-4 px-6'>
            <h2 className='text-xl font-semibold'>Your Events</h2>
            <ScrollArea className='h-[400px]'>
              {events.map(event => (
                <Link
                  key={event.id}
                  href={`/event/${event.id}`}
                  className='mb-4 block rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-colors hover:border-primary dark:border-gray-700 dark:bg-gray-800'
                >
                  <h3 className='text-lg font-medium'>{event.name}</h3>
                  <p className='mt-1 text-sm text-gray-500'>{event.description}</p>
                  <div className='mt-2 flex items-center gap-4 text-sm text-gray-500'>
                    <span>{event.location}</span>
                    <span>{event.date ? format(new Date(event.date), 'PPP') : 'No date set'}</span>
                  </div>
                </Link>
              ))}
              {events.length === 0 && <p className='text-center text-gray-500'>No events created yet.</p>}
            </ScrollArea>
          </section>
        </div>
      </main>
    </HydrateClient>
  );
}
