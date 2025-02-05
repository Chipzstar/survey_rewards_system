import React from 'react';
import { HydrateClient, trpc } from '~/trpc/server';
import { differenceInSeconds } from 'date-fns';
import { AddReferralForm } from './addReferralForm';
import Image from 'next/image';

export default async function ThankYouPage({ params }: { params: { id: string; userId: string } }) {
  const survey = await trpc.survey.byIdWithResults({ id: Number(params.id) });
  const response = survey.responses.find(r => r.user_id === params.userId);
  if (!response) throw new Error(`No response found for user ID:  ${params.userId}`);

  const completion_time = differenceInSeconds(new Date(response.completed_at), new Date(response.started_at));

  return (
    <HydrateClient>
      <main className='flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary to-secondary p-4 text-white md:p-24'>
        <div className='flex max-w-3xl flex-col items-center space-y-12 rounded-lg bg-white/10 p-6 text-center shadow-lg'>
          <h2 className='mb-4 text-3xl font-bold drop-shadow-md md:text-4xl'>Thanks for completing our survey!</h2>
          <p className='mb-6 text-pretty text-2xl'>
            Your finish time was&nbsp;
            <br />
            <span className='text-3xl font-bold text-secondary-800'>{completion_time} seconds</span>
          </p>
          <p className='mb-4 text-balance text-center text-xl md:w-2/3'>
            <span className='font-bold'>BOOST</span> your position further and get&nbsp;
            <span className='font-bold'>DOUBLE</span> points by sharing your event connections!
          </p>
          <AddReferralForm surveyId={survey.id} userId={response.user_id} />
          <Image src='/powered-by-genus.png' alt='Mount Motherland 2025' width={200} height={100} />
        </div>
      </main>
    </HydrateClient>
  );
}
