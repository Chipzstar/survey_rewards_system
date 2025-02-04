import React from 'react';
import { HydrateClient, trpc } from '~/trpc/server';
import { differenceInSeconds } from 'date-fns';
import { AddReferralForm } from '~/app/(app)/leaderboard/[surveyId]/[userId]/addReferralForm';

export default async function ThankYouPage({ params }: { params: { surveyId: string; userId: string } }) {
  const survey = await trpc.survey.byIdWithResponses({ id: Number(params.surveyId) });
  const response = survey.responses.find(r => r.user_id === params.userId);
  if (!response) throw new Error(`No response found for user ID:  ${params.userId}`);

  const completion_time = differenceInSeconds(new Date(response.completed_at), new Date(response.started_at));

  return (
    <HydrateClient>
      <main className='flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary to-secondary p-4 text-white md:p-24'>
        <div className='flex max-w-3xl flex-col items-center space-y-12 rounded-lg bg-white/10 p-6 text-center shadow-lg'>
          <h2 className='mb-4 text-3xl font-bold md:text-4xl'>Thanks for completing our survey!</h2>
          <p className='mb-6 text-2xl'>
            Your finish time was <span className='text-secondary-800 text-3xl font-bold'>{completion_time}</span>{' '}
            seconds
          </p>
          <p className='mb-4 text-balance text-center text-xl md:w-2/3'>
            <span className='font-bold'>BOOST</span> your position further and get&nbsp;
            <span className='font-bold'>DOUBLE</span> points by sharing your event connections!
          </p>
          <AddReferralForm />
          <p className='mt-4 text-xs text-gray-300'>Powered by Genus</p>
        </div>
      </main>
    </HydrateClient>
  );
}
