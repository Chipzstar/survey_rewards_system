import { auth } from '@clerk/nextjs/server';
import { HydrateClient, trpc } from '~/trpc/server';
import { differenceInSeconds } from 'date-fns';
import Link from 'next/link';
import { env } from '~/env';
import Image from 'next/image';
import React from 'react';
import { rankResponses, sortResponsesByCompletionTime } from '~/lib/utils';

export default async function WinnerAnnouncementPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { NEXT_PUBLIC_BASE_URL } = env;
  const user = await auth();

  const survey = await trpc.survey.byIdWithAnalytics({ id: Number(id) });

  const sortedResponses = survey.responses.sort(rankResponses(survey.responses));

  // Winner data
  const winnerData = sortedResponses
    .map((response, index) => {
      return {
        rank: index + 1,
        name: response.user_id,
        winnerRef: response.referrals || '#',
        points: response.points_earned,
        giftCardValue: survey.giftCards[0]?.value ?? '£30'
      };
    })
    .slice(0, survey.number_of_winners);

  return (
    <HydrateClient>
      <div className='my-auto flex grow flex-col gap-y-4 sm:mx-auto'>
        <div className='flex max-w-3xl grow flex-col items-center justify-around rounded-lg bg-white/10 p-6 shadow-lg'>
          <h2 className='mb-4 text-center text-3xl font-bold text-white'>
            The £{survey.giftCards[0]!.value} gift card winners are...
          </h2>
          <div className='mb-6 flex flex-col space-y-4'>
            {winnerData.map(winner => (
              <div key={winner.rank} className='flex flex-col items-center'>
                <h3 className='text-3xl font-bold text-white lg:text-4xl'>ID: {winner.name}</h3>
              </div>
            ))}
          </div>
          <section className='flex flex-col items-center space-y-4 text-center'>
            <h2 className='mb-4 text-2xl font-bold text-white lg:text-3xl'>Claim your gift card here</h2>
            <div className='px-2'>
              <Link
                href={`/survey/${id}/check-winner`}
                className='mt-2 text-wrap text-lg text-white underline'
                target={'_blank'}
              >
                <span>
                  {NEXT_PUBLIC_BASE_URL}/survey/{id}/check-winner
                </span>
              </Link>
            </div>
          </section>
        </div>
        <div className='flex flex-col items-center gap-4 text-center'>
          <Image src='/powered-by-genus.png' alt='Mount Motherland 2025' width={200} height={100} />
        </div>
      </div>
    </HydrateClient>
  );
}
