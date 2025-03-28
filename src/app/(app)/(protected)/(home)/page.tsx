import Link from 'next/link';
import { HydrateClient, trpc } from '~/trpc/server';
import Image from 'next/image';
import { CreateEventDialog } from '~/components/modals/create-event-dialog';
import { CreateSurveyDialog } from '~/components/modals/create-survey-dialog';
import { Card, CardContent } from '~/components/ui/card';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '~/components/ui/badge';

export default async function Dashboard() {
  const events = await trpc.event.fromUser();

  // Calculate KPIs
  const activeEvents = events.filter(event => new Date(event.date!) > new Date()).length;
  const completedEvents = events.filter(event => new Date(event.date!) <= new Date()).length;
  const totalEvents = events.length;

  return (
    <HydrateClient>
      <main className='flex grow flex-col p-6 pb-12 sm:h-full lg:px-12 lg:py-6 xl:px-12 xl:pb-12 2xl:px-24'>
        {events.length === 0 ? (
          <div className='flex flex-1 flex-col items-center justify-center gap-4'>
            <Image src='/document-text.svg' alt='No Events or Surveys Yet' width={120} height={120} />
            <h2 className='text-2xl font-medium text-sub dark:text-white'>No Events or Surveys Yet</h2>
            <p className='text-gray-500 dark:text-white'>Get started by creating your first event or survey!</p>
            <div className='mt-4 flex gap-4'>
              <CreateEventDialog />
              <CreateSurveyDialog events={events} variant='neutral' />
            </div>
          </div>
        ) : (
          <div className='grid h-full grid-cols-1 gap-y-8'>
            {/* Overview Section */}
            <section>
              <div className='mb-6 flex items-center justify-between'>
                <h2 className='text-2xl'>Overview</h2>
                <div className='flex gap-4'>
                  <CreateEventDialog />
                  <CreateSurveyDialog events={events} />
                </div>
              </div>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                <Card>
                  <CardContent className='flex flex-col space-y-6 p-6'>
                    <span className='text-sm text-gray-500'>Total Events</span>
                    <span className='text-3xl font-medium'>{totalEvents}</span>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className='flex flex-col space-y-6 p-6'>
                    <span className='text-sm text-gray-500'>Active Events</span>
                    <span className='text-3xl font-medium'>{activeEvents}</span>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className='flex flex-col space-y-6 p-6'>
                    <span className='text-sm text-gray-500'>Completed Events</span>
                    <span className='text-3xl font-medium'>{completedEvents}</span>
                  </CardContent>
                </Card>
              </div>
            </section>
            {/* Events Section */}
            <section className='flex flex-col space-y-4'>
              <h2 className='text-2xl'>Your Events</h2>
              {events.map(event => {
                const eventDate = new Date(event.date!);
                const isActive = eventDate > new Date();
                const isCompleted = eventDate <= new Date();
                return (
                  <Link
                    key={event.id}
                    href={`/event/${event.id}`}
                    className='mb-4 block rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-colors hover:border-primary dark:border-gray-700 dark:bg-gray-800'
                  >
                    <div className='flex items-start justify-between'>
                      <div>
                        <h3 className='text-lg font-medium'>{event.name}</h3>
                        <p className='mt-1 text-sm text-gray-500'>{event.description}</p>
                        <div className='mt-2 flex items-center gap-2 text-sm text-gray-500'>
                          <CalendarIcon className='h-4 w-4' />
                          <span>{event.date ? format(new Date(event.date), 'MMM dd, yyyy') : 'No date set'}</span>
                          <span>•</span>
                          <span>{event.location}</span>
                        </div>
                      </div>
                      <Badge variant={isActive ? 'active' : isCompleted ? 'completed' : 'upcoming'}>
                        {isActive ? 'Active' : isCompleted ? 'Completed' : 'Upcoming'}
                      </Badge>
                    </div>
                  </Link>
                );
              })}
            </section>
          </div>
        )}
      </main>
    </HydrateClient>
  );
}
