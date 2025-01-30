import { Button } from '~/components/ui/button';
import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';
import { trpc } from '~/trpc/server';
import { differenceInMinutes, differenceInSeconds, format } from 'date-fns';
import { DataTable } from '~/components/leaderboard/data-table';
import { columns } from '~/components/leaderboard/columns';
import { MainNav } from '~/components/layout/main-nav';

export default async function SurveyDashboard({ params }: { params: { id: string } }) {
  const { id } = params;
  const user = await auth();

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
  const avg_completion_time = total_completion_time / surveys_completed.length;

  // Data
  const sortedResponses = survey.responses.sort((a, b) => {
    const timeA = differenceInSeconds(new Date(a.completed_at), new Date(a.started_at));
    const timeB = differenceInSeconds(new Date(b.completed_at), new Date(b.started_at));
    return timeA - timeB; // Sort ascending (lowest to highest)
  });
  const data = sortedResponses.map((response, index) => {
    const completion_time = differenceInSeconds(new Date(response.completed_at), new Date(response.started_at));
    return {
      rank: index + 1,
      name: response.user.firstname,
      time: completion_time,
      ref: survey.referrals.filter(r => r.referrer_id === response.user_id).length ?? 0,
      total: response.points_earned
    };
  });

  const isSurveyClosed = survey.end_date < new Date();

  if (!survey) {
    return (
      <main className='flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary to-secondary p-4 text-white'>
        <div className='text-center'>
          <h1 className='mb-4 text-4xl font-bold'>Survey Not Found</h1>
          <p className='mb-8 text-xl'>The survey you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link href='/'>Return to Dashboard</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <div className='mx-auto flex w-full max-w-3xl flex-col'>
      <section className='flex flex-col'>
        <h2 className='mb-2 text-2xl font-bold md:mb-4'>The Big Picture</h2>
        <div className='mb-2 flex gap-4 md:mb-4 md:gap-8'>
          <div className='flex flex-col items-center'>
            <h3 className='text-xl font-semibold'>Completed surveys</h3>
            <p className='text-2xl font-bold md:text-3xl'>{surveys_completed.length}</p>
          </div>
          <div className='flex flex-col items-center'>
            <h3 className='text-xl font-semibold'># of referrals</h3>
            <p className='text-2xl font-bold md:text-3xl'>{survey.referrals.length}</p>
          </div>
        </div>
        <div className='mb-2 flex flex-col gap-1 md:mb-4 md:gap-2'>
          <p>
            No. of surveys started: <span className='font-bold'>{survey.responses.length}</span>
          </p>
          <p>
            No. of surveys completed: <span className='font-bold'>{surveys_completed.length}</span>
          </p>
          <p>
            Survey completion rate: <span className='font-bold'>{completion_rate}%</span>
          </p>
          <p>
            Average time taken: <span className='font-bold'>{avg_completion_time}mins</span>
          </p>
          <p>
            Total no. of referrals: <span className='font-bold'>{survey.referrals.length}</span>
          </p>
        </div>
      </section>
      <section className='mt-5 flex flex-col'>
        <h2 className='mb-2 text-2xl font-bold md:mb-4'>Gift card Leaderboard</h2>
        <div className='w-full overflow-x-auto'>
          <DataTable columns={columns} data={data} />
        </div>
      </section>
    </div>
  );
}
