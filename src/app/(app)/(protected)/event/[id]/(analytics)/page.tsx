import { HydrateClient, trpc } from '~/trpc/server';
import { differenceInMinutes } from 'date-fns';
import { Card, CardContent } from '~/components/ui/card';
import { DataTable } from './data-table';
import { columns, SurveyData } from './columns';
import Container from '~/components/layout/Container';
import { Button } from '~/components/ui/button';
import Link from 'next/link';
import RequestInsightReport from './_request-insight-report';
import { capitalize } from '~/lib/utils';
import { ShareIcon } from 'lucide-react';
import { ShareEventStats } from '~/components/event/ShareEventStats';

interface WordCloudStyle {
  bg: string;
  text: string;
}

const WORD_CLOUD_COLORS: WordCloudStyle[] = [
  { bg: 'bg-purple-100', text: 'text-purple-700' },
  { bg: 'bg-cyan-100', text: 'text-cyan-700' },
  { bg: 'bg-blue-100', text: 'text-blue-700' },
  { bg: 'bg-orange-100', text: 'text-orange-700' },
  { bg: 'bg-teal-100', text: 'text-teal-700' }
];

export default async function EventAnalytics({
  params,
  searchParams
}: {
  params: { id: string };
  searchParams: { [key: string]: string | undefined };
}) {
  const { id } = params;
  const event = await trpc.event.byId({ id: Number(id) });
  const surveys = await trpc.survey.byEventId({ eventId: Number(id) });

  // Statistics
  const analytics = surveys.map(survey => {
    const surveys_completed = survey.responses.filter(response => response.is_completed);
    const total_completion_time = surveys_completed.reduce((acc, response) => {
      const diff = differenceInMinutes(new Date(response.completed_at), new Date(response.started_at));
      // console.log(format(response.started_at, 'hh:mm:ss'));
      // console.log(format(response.completed_at, 'hh:mm:ss'));
      return acc + diff;
    }, 0);
    const avg_completion_time = Number(total_completion_time / surveys_completed.length);

    return {
      id: survey.id,
      name: survey.name,
      responses: survey.responses.length,
      time: avg_completion_time
    } satisfies SurveyData;
  });

  const totalResponses = analytics.reduce((acc, survey) => acc + survey.responses, 0);
  const averageTimeTaken = Number(analytics.reduce((acc, survey) => acc + survey.time, 0) / analytics.length).toFixed(
    1
  );

  const filteredSurveys = analytics.filter(survey => {
    const query = searchParams?.query;
    if (!query || query.length === 0) return true;
    return survey.name.toLowerCase().includes(query.toLowerCase());
  });

  // Aggregate top words from all survey responses
  const wordFrequencyMap = new Map<string, number>();
  surveys.forEach(survey => {
    survey.responses.forEach(response => {
      if (response.top_words) {
        const words = response.top_words.split(',').map(word => capitalize(word.trim()));
        words.forEach(word => {
          wordFrequencyMap.set(word, (wordFrequencyMap.get(word) || 0) + 1);
        });
      }
    });
  });

  // Get top 5 words
  const topWords = Array.from(wordFrequencyMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word]) => word);

  // get testimonials
  const testimonials = surveys.flatMap(survey => {
    return survey.responses
      .filter(response => response.is_completed && response.testimonial)
      .map(response => ({
        text: response.testimonial,
        rating: response.rating
      }));
  });

  return (
    <HydrateClient>
      <Container>
        {/* Overview Section */}
        <section>
          <div className='mb-6 flex flex-col space-y-4'>
            <h2 className='text-2xl'>Analytics</h2>
          </div>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
            <Card>
              <CardContent className='flex flex-col space-y-6 p-6'>
                <span className='text-sm text-gray-500'>Total Responses</span>
                <span className='text-3xl font-medium'>{totalResponses}</span>
              </CardContent>
            </Card>
            <Card>
              <CardContent className='flex flex-col space-y-6 p-6'>
                <span className='text-sm text-gray-500'>Average Score</span>
                <span className='text-3xl font-medium'>4.5</span>
              </CardContent>
            </Card>
            <Card>
              <CardContent className='flex flex-col space-y-6 p-6'>
                <span className='text-sm text-gray-500'>Average Time Taken</span>
                <span className='text-3xl font-medium'>{averageTimeTaken} mins</span>
              </CardContent>
            </Card>
            <Card>
              <CardContent className='flex flex-col space-y-6 p-6'>
                <span className='text-sm text-gray-500'>Report and Data Cube</span>
                {event.insight_report ? (
                  <Link
                    href={event.insight_report}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-3xl font-medium text-primary underline'
                  >
                    View
                  </Link>
                ) : (
                  <RequestInsightReport event={event} />
                )}
              </CardContent>
            </Card>
          </div>
        </section>
        <Card className='mt-5 flex flex-col px-4 py-6'>
          <h2 className='mb-4 text-2xl md:mb-8'>Survey Performance details</h2>
          <div className='w-full overflow-x-auto'>
            <DataTable columns={columns} data={filteredSurveys} />
          </div>
        </Card>

        {/* Event Marketing Post Section */}
        <div className='mt-8 flex items-center justify-between'>
          <h2 className='text-2xl'>Event Marketing Post</h2>
          <ShareEventStats
            eventName={event.name}
            attendees={event.num_attendees}
            speakers={event.num_speakers}
            topWords={topWords}
            testimonials={testimonials}
          />
        </div>

        <div className='mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2'>
          {/* Attendee Stats */}
          <Card className='p-6'>
            <h3 className='mb-6 text-xl'>Attendee Feedback</h3>
            <div className='grid grid-cols-2 gap-12'>
              <div>
                <p className='text-sm text-gray-500'>Attendees</p>
                <p className='text-5xl font-medium'>{event.num_attendees}</p>
              </div>
              <div>
                <p className='text-sm text-gray-500'>Speakers</p>
                <p className='text-5xl font-medium'>{event.num_speakers}</p>
              </div>
            </div>
          </Card>

          {/* Word Cloud */}
          <Card className='p-6'>
            <h3 className='mb-6 text-xl'>Top Words Used to Describe Event</h3>
            <div className='flex flex-wrap gap-2'>
              {topWords.map((word, index) => {
                const colorStyle = WORD_CLOUD_COLORS[index % WORD_CLOUD_COLORS.length];
                return (
                  <span key={word} className={`rounded-full px-4 py-1 ${colorStyle.bg} ${colorStyle.text}`}>
                    {word}
                  </span>
                );
              })}
            </div>
          </Card>

          {/* Testimonials */}
          <div className='grid gap-4 lg:col-span-2'>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              {testimonials
                .slice(0, 4) // Limit to 4 testimonials
                .map((response, i) => (
                  <Card key={i} className='relative overflow-hidden p-6 shadow-lg'>
                    <div
                      className={`absolute inset-y-0 left-0 w-1 ${
                        ['bg-teal-500', 'bg-blue-500', 'bg-purple-500', 'bg-blue-500'][i]
                      }`}
                    />
                    <div className='space-y-4'>
                      <p className='text-gray-600'>"{response.text}"</p>
                      <div>
                        <p className='font-medium'>Anonymous</p>
                        <div className='flex text-yellow-400'>{'★'.repeat(response.rating || 5)}</div>
                      </div>
                    </div>
                  </Card>
                ))}
            </div>
          </div>
        </div>
      </Container>
    </HydrateClient>
  );
}
