import React from 'react';
import { HydrateClient, trpc } from '~/trpc/server';
import { format } from 'date-fns';
import Image from 'next/image';

export default async function WinnerDetailsPage({ params }: { params: { id: string; userId: string } }) {
  const winner = await trpc.winner.getSurveyWinner({ surveyId: Number(params.id), userId: params.userId });
  const giftCardDetails = winner.giftCard;

  if (!winner) throw new Error('No Survey winner found');
  if (!giftCardDetails) throw new Error('No Gift Card found');

  return (
    <HydrateClient>
      <main className='flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary to-secondary p-4 text-white md:p-24'>
        <div className='flex w-full max-w-3xl flex-col items-center rounded-lg bg-white/10 p-6 shadow-lg'>
          <h2 className='mb-4 text-center text-3xl font-bold drop-shadow-md md:text-4xl'>Congratulations! 🎉</h2>
          <p className='mb-6 text-center text-2xl'>You have won the Gift Card! 🥳</p>
          <div className='mb-4 rounded-md bg-blue-500 px-16 py-12 text-center'>
            <p className='text-3xl font-bold'>{giftCardDetails.brand}</p>
          </div>
          <p className='mb-2'>Amount: £{giftCardDetails.value}</p>
          <p className='mb-2'>Voucher code: {giftCardDetails.code}</p>
          <p>Expiry date: {format(new Date(giftCardDetails.expiry_date), 'dd/MM/yyyy')}</p>
          <p className='mt-4 text-sm text-gray-300'>{winner.survey.name}</p>
          {/*<p className='text-sm text-gray-300'>Okwu ID & Ozo Run Club Team</p>*/}
          <Image src='/powered-by-genus.png' alt='Mount Motherland 2025' width={200} height={100} />
        </div>
      </main>
    </HydrateClient>
  );
}
