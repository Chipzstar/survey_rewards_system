import React from 'react';
import { trpc } from '~/trpc/server';
import { differenceInSeconds } from 'date-fns';
import { AddReferralForm } from '~/app/(app)/leaderboard/[surveyId]/[userId]/addReferralForm';

export default async function ThankYouPage({ params }: { params: { surveyId: string; userId: string } }) {
  // Replace w
  const survey = await trpc.survey.byIdWithResponses({ id: Number(params.userId) });
  const response = survey.responses.find(r => r.user_id === params.userId);
  if (!response) throw new Error(`No response found for user ID:  ${params.userId}`);

  const completion_time = differenceInSeconds(new Date(response.completed_at), new Date(response.started_at));

  return (
    <main className='flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary to-secondary p-4 text-white md:p-24'>
      <div className='flex max-w-3xl flex-col items-center space-y-12 rounded-lg bg-white/10 p-6 shadow-lg'>
        <h2 className='mb-4 text-4xl font-bold'>Thanks for completing our survey!</h2>
        <p className='mb-6 text-2xl'>Your finish time was {completion_time} seconds</p>
        <p className='mb-4 text-balance text-center text-xl md:w-2/3'>
          One last chance to get <span className='font-bold'>EXTRA</span> points by nudging your event connections!
        </p>
        <AddReferralForm />
        <p className='mt-4 text-xs text-gray-300'>Powered by Genus</p>
      </div>
    </main>
  );
}
