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
  const rewards = survey.rewardSurveys?.map(rs => rs.reward) ?? [];
  const selectedReward = rewards[Math.floor(Math.random() * rewards.length)];
  if (!selectedReward) throw new Error('No reward found');

  const rewardImages = rewards
    .map(reward => reward.thumbnail)
    .filter((src): src is string => Boolean(src));

  const floatPositions = [
    'top-0 left-4 md:left-10',
    'top-10 right-3 md:right-16',
    'bottom-10 left-4 md:left-16',
    'top-1/3 right-0 md:right-6',
    'bottom-0 right-4 md:right-12',
    'top-1/2 -left-2 md:left-20',
    'top-1/2 -right-2 md:right-20',
    'top-1/3 left-0 md:left-6',
  ];

  return (
    <HydrateClient>
      <main className='flex min-h-screen flex-col bg-gradient-to-b from-primary to-[#DDFBFF] p-4'>
        <div className='mt-8 px-4'>
          <h1 className='text-2xl font-medium text-white'>Download</h1>
        </div>

        <section className='relative flex flex-1 items-center justify-center px-4 py-10'>
          {rewardImages.length > 0 && (
            <div className='pointer-events-none absolute inset-0 flex items-center justify-center'>
              <div className='relative h-[420px] w-full max-w-5xl'>
                {rewardImages.slice(0, 16).map((src, index) => {
                  const position = floatPositions[index % floatPositions.length];
                  const sizeClass = index % 3 === 0 ? 'h-28 w-28 md:h-32 md:w-32' : 'h-24 w-24 md:h-28 md:w-28';

                  return (
                    <div
                      key={`${src}-${index}`}
                      className={`absolute ${position} rounded-2xl bg-white/40 p-2 shadow-lg shadow-primary/20 backdrop-blur-md`}
                    >
                      <div className={`relative overflow-hidden rounded-xl bg-white ${sizeClass}`}>
                        <Image
                          src={src}
                          alt='Reward preview'
                          fill
                          sizes='80px'
                          className='object-contain'
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className='relative z-10 w-full max-w-md rounded-2xl bg-white/95 p-8 shadow-xl shadow-cyan-900/10'>
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

              <p className='text-center text-gray-600'>Unlock your exclusive voucher here</p>

              <DownloadResource reward={selectedReward} />
            </div>
          </div>
        </section>
      </main>
    </HydrateClient>
  );
}
