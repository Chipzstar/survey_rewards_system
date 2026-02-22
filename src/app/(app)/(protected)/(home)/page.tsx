import { HydrateClient, trpc } from '~/trpc/server';
import Image from 'next/image';
import { CreateEventDialog } from '~/components/modals/create-event-dialog';
import { CreateSurveyDialog } from '~/components/modals/create-survey-dialog';
import { Card, CardContent } from '~/components/ui/card';
import { isAfter } from 'date-fns';
import Container from '~/components/layout/Container';
import { EventsList } from '~/app/(app)/(protected)/(home)/events-list';

export default async function Dashboard({
  params,
  searchParams
}: {
  params: { id: string };
  searchParams: { [key: string]: string | undefined };
}) {
  const events = await trpc.event.fromUser();

  // Calculate KPIs
  const activeEvents = events.filter(event => new Date(event.date!) > new Date()).length;
  const completedEvents = events.filter(event => isAfter(event.date!, new Date())).length;
  const totalEvents = events.length;

  const filteredEvents = events.filter(event => {
    const query = searchParams?.query;
    if (!query || query.length === 0) return true;
    return event.name.toLowerCase().includes(query.toLowerCase());
  });

  return (
    <HydrateClient>
      <Container>
        {events.length === 0 ? (
          <div className='flex flex-1 flex-col items-center justify-center gap-4'>
            <Image src='/image/document-text.svg' alt='No Events or Surveys Yet' width={120} height={120} />
            <h2 className='text-2xl font-medium text-sub dark:text-white'>No Events or Surveys Yet</h2>
            <p className='text-gray-500 dark:text-white'>Get started by creating your first event or survey!</p>
            <div className='mt-4 flex gap-4'>
              <CreateEventDialog variant='outline' />
              <CreateSurveyDialog events={events} variant='neutral' />
            </div>
          </div>
        ) : (
          <div className='flex h-full flex-col gap-y-8'>
            {/* Overview Section */}
            <section className='shrink'>
              <div className='mb-6 flex flex-col justify-between space-y-4 md:flex-row md:items-center md:space-y-0'>
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
            <EventsList events={filteredEvents} />
          </div>
        )}
      </Container>
    </HydrateClient>
  );
}
