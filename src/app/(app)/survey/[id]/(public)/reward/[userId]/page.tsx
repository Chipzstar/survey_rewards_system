import React from 'react';
import { HydrateClient, trpc } from '~/trpc/server';
import { differenceInSeconds } from 'date-fns';
import Image from 'next/image';
import DownloadResource from '~/app/(app)/survey/[id]/(public)/reward/[userId]/download-resource';

export default async function ThankYouPage({ params }: { params: { id: string; userId: string } }) {
  const survey = await trpc.survey.byIdWithResults({ id: Number(params.id) });
  const response = survey.responses.find(r => r.user_id === params.userId);

  if (!response) throw new Error(`No response found for user ID:  ${params.userId}`);

  // choose a reward at random
  const selectedReward = survey.rewards[Math.floor(Math.random() * survey.rewards.length)];

  // const referrals = await trpc.referral.getReferrals({ surveyId: Number(params.id), userId: params.userId });

  const completion_time = differenceInSeconds(new Date(response.completed_at), new Date(response.started_at));

  return (
    <HydrateClient>
      <main className='flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary to-secondary p-4 text-white md:p-24'>
        <div className='flex max-w-3xl flex-col items-center space-y-12 rounded-lg bg-white/10 p-6 text-center shadow-lg'>
          <h2 className='mb-4 text-3xl font-bold drop-shadow-md md:text-4xl'>Congratulations!🤩</h2>
          {selectedReward ? (
            <>
              <p className='mb-6 text-pretty text-2xl'>{selectedReward.cta_text}</p>
              {/*<p className='mb-4 text-balance text-center text-xl md:w-2/3'>
                <span className='font-bold'>BOOST</span> your position further and get&nbsp;
                <span className='font-bold'>DOUBLE</span> points by sharing your event connections!
              </p>*/}
              <DownloadResource reward={selectedReward} />
              {/*<AddReferralForm surveyId={survey.id} userId={response.user_id} />*/}
            </>
          ) : (
            <>
              <p className='mb-6 text-pretty text-2xl'>
                Your finish time was&nbsp;
                <br />
                <span className='text-3xl font-bold text-secondary-800'>{completion_time} seconds</span>
              </p>
              {/*<p className='mb-4 text-balance text-center text-xl md:w-2/3'>
                <span className='font-bold'>BOOST</span> your position further and get&nbsp;
                <span className='font-bold'>DOUBLE</span> points by sharing your event connections!
              </p>*/}
              <p className='mb-6 text-pretty text-2xl'>
                Total points earned:
                <br />
                <span className='text-3xl font-bold text-secondary-800'>{response.points_earned} points</span>
              </p>
              {/*<AddReferralForm surveyId={survey.id} userId={response.user_id} />*/}
            </>
          )}
          <p className='mb-10 text-pretty text-xl'>{survey.event.name}</p>
          <Image src='/powered-by-genus.png' alt='Mount Motherland 2025' width={200} height={100} />
        </div>
      </main>
    </HydrateClient>
  );
}
