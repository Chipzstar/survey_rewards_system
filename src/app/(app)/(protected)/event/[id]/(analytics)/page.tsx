import { HydrateClient, trpc } from '~/trpc/server';
import { differenceInMinutes } from 'date-fns';
import { Card, CardContent } from '~/components/ui/card';
import { DataTable } from './data-table';
import { columns, SurveyData } from './columns';
import Container from '~/components/layout/Container';

export default async function EventAnalytics({ params }: { params: { id: string } }) {
  const { id } = params;

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
                <span className='text-3xl font-medium text-primary underline'>View</span>
              </CardContent>
            </Card>
          </div>
        </section>
        <Card className='mt-5 flex flex-col px-4 py-6'>
          <h2 className='mb-4 text-2xl md:mb-8'>Survey Performance details</h2>
          <div className='w-full overflow-x-auto'>
            <DataTable columns={columns} data={analytics} />
          </div>
        </Card>
      </Container>
    </HydrateClient>
  );
}
