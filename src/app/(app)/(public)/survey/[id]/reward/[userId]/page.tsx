import React from 'react';
import { HydrateClient, trpc } from '~/trpc/server';
import Image from 'next/image';
import DownloadResource from './download-resource';

export default async function ThankYouPage({ params }: { params: { id: string; userId: string } }) {
  const survey = await trpc.survey.byIdWithResults({ id: Number(params.id) });
  if (!survey.event) throw new Error('Event not found');

  const response = survey.responses.find(r => r.user_id === params.userId);
  if (!response) throw new Error(`No response found for user ID:  ${params.userId}`);

  // choose a reward at random
  const selectedReward = survey.rewards[Math.floor(Math.random() * survey.rewards.length)];
  if (!selectedReward) throw new Error('No reward found');

  return (
    <HydrateClient>
      <main className='flex min-h-screen flex-col bg-gradient-to-b from-primary to-[#DDFBFF] p-4'>
        <div className='mt-8 px-4'>
          <h1 className='text-2xl font-medium text-white'>Download</h1>
        </div>

        <div className='flex flex-1 flex-col items-center justify-center px-4'>
          <div className='w-full max-w-md rounded-2xl bg-white/95 p-8 shadow-lg'>
            <div className='flex flex-col items-center space-y-6'>
              <div className='relative h-[200px] w-[200px]'>
                <Image
                  src='/confetti.png'
                  alt='Confetti'
                  width={200}
                  height={200}
                  className='absolute inset-0'
                  priority
                />
                <div className='absolute inset-0 flex items-center justify-center'>
                  <Image
                    src='/gift-box.svg'
                    alt='Gift Box'
                    width={140}
                    height={140}
                    className='animate-bounce-slow'
                    priority
                  />
                </div>
              </div>
              
              <h2 className='text-2xl font-medium text-gray-900'>Congratulations!!</h2>
              
              <p className='text-center text-gray-600'>
                Unlock your exclusive resource pack here
              </p>

              <DownloadResource reward={selectedReward} />
            </div>
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}
