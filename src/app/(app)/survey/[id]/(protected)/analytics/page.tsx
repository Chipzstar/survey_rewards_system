import { Button } from '~/components/ui/button';
import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';
import { HydrateClient, trpc } from '~/trpc/server';
import { differenceInMinutes, differenceInSeconds } from 'date-fns';
import { DataTable } from '~/components/leaderboard/data-table';
import { columns } from '~/components/leaderboard/columns';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { sortResponsesByCompletionTime } from '~/lib/utils';

export default async function SurveyAnalytics({ params }: { params: { id: string } }) {
  const { id } = params;

  const survey = await trpc.survey.byIdWithAnalytics({ id: Number(id) });

  // Statistics
  const surveys_completed = survey.responses.filter(response => response.is_completed);
  const completion_rate = ((surveys_completed.length / survey.responses.length) * 100).toFixed(1);
  const total_completion_time = surveys_completed.reduce((acc, response) => {
    const diff = differenceInMinutes(new Date(response.completed_at), new Date(response.started_at));
    // console.log(format(response.started_at, 'hh:mm:ss'));
    // console.log(format(response.completed_at, 'hh:mm:ss'));
    return acc + diff;
  }, 0);
  const avg_completion_time = Number(total_completion_time / surveys_completed.length).toFixed(2);
  const total_referrals = survey.responses.reduce((acc, r) => {
    return acc + r.referrals;
  }, 0);
  const avg_referrals = Number(total_referrals / survey.responses.length).toFixed(2);

  // Data
  const sortedResponses = sortResponsesByCompletionTime(survey.responses);

  const data = sortedResponses.map((response, index) => {
    const completion_time = differenceInSeconds(new Date(response.completed_at), new Date(response.started_at));
    return {
      rank: index + 1,
      userId: response.user_id,
      time: completion_time,
      ref: response.referrals,
      total: response.points_earned
    };
  });

  if (!survey) {
    return (
      <main className='flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary to-secondary p-4 text-white'>
        <div className='text-center'>
          <h1 className='mb-4 text-4xl font-bold'>Survey Not Found</h1>
          <p className='mb-8 text-xl'>The survey you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link href='/public'>Return to Dashboard</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <HydrateClient>
      <div className='mx-auto flex w-full max-w-3xl flex-col text-white'>
        <section className='flex flex-col'>
          <h2 className='mb-2 text-2xl font-bold md:mb-4'>The Big Picture</h2>
          <div className='mb-4 grid grid-cols-2 gap-4'>
            <Card className='border-gray-200 bg-transparent text-white dark:border-gray-200 dark:bg-white/10'>
              <CardHeader>
                <CardTitle className='text-xl font-semibold'>Completed Surveys</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='text-4xl font-bold'>{surveys_completed.length}</div>
              </CardContent>
            </Card>
            <Card className='border-gray-200 bg-transparent text-white dark:border-gray-200 dark:bg-white/10'>
              <CardHeader>
                <CardTitle className='text-xl font-semibold'># of referrals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='text-4xl font-bold'>{total_referrals}</div>
              </CardContent>
            </Card>
          </div>
          <div className='mb-2 flex flex-col gap-1 md:mb-4 md:gap-2'>
            <ul className='divide-y divide-white'>
              <li className='py-2'>
                <div className='flex items-center justify-between'>
                  <span>No. of surveys started:</span>
                  <span className='font-bold'>{survey.responses.length}</span>
                </div>
              </li>
              <li className='py-2'>
                <div className='flex items-center justify-between'>
                  <span>No. of surveys completed:</span>
                  <span className='font-bold'>{surveys_completed.length}</span>
                </div>
              </li>
              <li className='py-2'>
                <div className='flex items-center justify-between'>
                  <span>Survey completion rate:</span>
                  <span className='font-bold'>{completion_rate}%</span>
                </div>
              </li>
              <li className='py-2'>
                <div className='flex items-center justify-between'>
                  <span>Average time taken:</span>
                  <span className='font-bold'>{avg_completion_time} mins</span>
                </div>
              </li>
              <li className='py-2'>
                <div className='flex items-center justify-between'>
                  <span>Total no. of referrals:</span>
                  <span className='font-bold'>{total_referrals}</span>
                </div>
              </li>
              <li className='py-2'>
                <div className='flex items-center justify-between'>
                  <span>Av. number of referrals:</span>
                  <span className='font-bold'>{avg_referrals}</span>
                </div>
              </li>
            </ul>
          </div>
        </section>
        <section className='mt-5 flex flex-col'>
          <h2 className='mb-2 text-2xl font-bold md:mb-4'>Gift card Leaderboard</h2>
          <div className='w-full overflow-x-auto'>
            <DataTable columns={columns} data={data} />
          </div>
        </section>
      </div>
    </HydrateClient>
  );
}
