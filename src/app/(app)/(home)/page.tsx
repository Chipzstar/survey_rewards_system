import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';
import { HydrateClient, trpc } from '~/trpc/server';
import { SurveyListCard } from '~/app/(app)/(home)/survey-list-card';
import { CreateEventDialog } from '~/components/modals/create-event-dialog';
import { format } from 'date-fns';
import { CreateSurveyDialog } from '~/components/modals/create-survey-dialog';

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

  const [surveys, events] = await Promise.all([trpc.survey.fromUser(), trpc.event.fromUser()]);

  return (
    <HydrateClient>
      <main className='flex min-h-screen grow flex-col p-6 xl:p-12 2xl:p-24'>
        <div className='mb-8 flex w-full items-center justify-between'>
          <h1 className='text-4xl font-bold'>Dashboard</h1>
          <UserButton afterSignOutUrl='/' />
        </div>
        <div className='grid h-full grid-cols-1 gap-8 lg:grid-cols-2'>
          {/* Events Section */}
          <section className='flex flex-col justify-center'>
            <div className='mb-4 flex items-center justify-between'>
              <h2 className='text-2xl font-semibold'>Events</h2>
              <CreateEventDialog />
            </div>
            <div className='space-y-4'>
              {events.map(event => (
                <div
                  key={event.id}
                  className='rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-colors hover:border-primary dark:border-gray-700 dark:bg-gray-800'
                >
                  <h3 className='text-lg font-medium'>{event.name}</h3>
                  <p className='mt-1 text-sm text-gray-500'>{event.description}</p>
                  <div className='mt-2 flex items-center gap-4 text-sm text-gray-500'>
                    <span>{event.location}</span>
                    <span>{event.date ? format(new Date(event.date), 'PPP') : 'No date set'}</span>
                  </div>
                </div>
              ))}
              {events.length === 0 && <p className='text-center text-gray-500'>No events created yet.</p>}
            </div>
          </section>

          {/* Surveys Section */}
          <section>
            <div className='mb-4 flex items-center justify-between'>
              <h2 className='text-2xl font-semibold'>Surveys</h2>
              <CreateSurveyDialog />
            </div>
            <div className='space-y-4'>
              {surveys.map(survey => (
                <SurveyListCard key={survey.id} survey={survey} />
              ))}
              {surveys.length === 0 && <p className='text-center text-gray-500'>No surveys created yet.</p>}
            </div>
          </section>
        </div>
      </main>
    </HydrateClient>
  );
}
