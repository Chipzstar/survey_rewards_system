import { auth } from '@clerk/nextjs/server';
import { HydrateClient, trpc } from '~/trpc/server';
import { differenceInSeconds } from 'date-fns';
import { Button } from '~/components/ui/button';
import Link from 'next/link';
import { DataTable } from '~/components/leaderboard/data-table';
import { columns } from '~/components/leaderboard/columns';
import { rankResponses } from '~/lib/utils';

export default async function SurveyAnalytics({ params }: { params: { id: string } }) {
  const { id } = params;
  const user = await auth();

  const survey = await trpc.survey.byIdWithResults({ id: Number(id) });

  // Data
  const sortedResponses = survey.responses.sort(rankResponses(survey.responses));

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
        <section className='mt-5 flex flex-col'>
          <h2 className='mb-2 text-2xl font-bold md:mb-4'>Gift Card Leaderboard</h2>
          <div className='w-full overflow-x-auto'>
            <DataTable surveyId={id} columns={columns} data={data} />
          </div>
        </section>
      </div>
    </HydrateClient>
  );
}
