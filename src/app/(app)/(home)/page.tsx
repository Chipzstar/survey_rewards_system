import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';
import { HydrateClient, trpc } from '~/trpc/server';
import { SurveyListCard } from '~/app/(app)/(home)/survey-list-card';
import { CreateEventDialog } from '~/components/modals/create-event-dialog';
import { format } from 'date-fns';
import { CreateSurveyDialog } from '~/components/modals/create-survey-dialog';
import { ScrollArea } from '~/components/ui/scroll-area';
import { prettyPrint } from '~/lib/utils';

export default async function Dashboard() {
  const user = await auth();
  prettyPrint(user);

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

  const [surveys, events] = await Promise.all([trpc.survey.fromUser(), trpc.event.fromUser()]);

  return (
    <HydrateClient>
      <main className='flex min-h-screen grow flex-col p-6 sm:h-screen xl:p-12 2xl:p-24'>
        <div className='mb-8 flex w-full items-center justify-between'>
          <h1 className='text-4xl font-bold'>Dashboard</h1>
          <UserButton afterSignOutUrl='/' />
        </div>
        <div className='grid h-full grid-cols-1 gap-y-8 lg:grid-cols-2 lg:divide-x-2 lg:divide-gray-200'>
          {/* Events Section */}
          <section className='flex grow flex-col lg:px-6'>
            <div className='mb-4 flex items-center justify-between'>
              <h2 className='text-2xl font-semibold'>Events</h2>
              <CreateEventDialog />
            </div>
            <ScrollArea className='flex flex-col sm:h-[72vh]'>
              {events.map(event => (
                <div
                  key={event.id}
                  className='mb-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-colors hover:border-primary dark:border-gray-700 dark:bg-gray-800'
                >
                  <h3 className='text-lg font-medium'>{event.name}</h3>
                  <p className='mt-1 text-sm text-gray-500'>{event.description}</p>
                  <div className='mt-2 flex items-center gap-4 text-sm text-gray-500'>
                    <span>{event.location}</span>
                    <span>{event.date ? format(new Date(event.date), 'PPP') : 'No date set'}</span>
                  </div>
                </div>
              ))}
              <div className='my-auto'>
                {events.length === 0 && <p className='text-center text-gray-500'>No events created yet.</p>}
              </div>
            </ScrollArea>
          </section>

          {/* Surveys Section */}
          <section className='flex grow flex-col lg:px-6'>
            <div className='mb-4 flex items-center justify-between'>
              <h2 className='text-2xl font-semibold'>Surveys</h2>
              <CreateSurveyDialog events={events} />
            </div>
            <ScrollArea className='flex flex-col sm:h-[72vh]'>
              {surveys.map(survey => (
                <SurveyListCard key={survey.id} survey={survey} />
              ))}
              <div className='my-auto'>
                {surveys.length === 0 && <p className='text-center text-gray-500'>No surveys created yet.</p>}
              </div>
            </ScrollArea>
          </section>
        </div>
      </main>
    </HydrateClient>
  );
}
