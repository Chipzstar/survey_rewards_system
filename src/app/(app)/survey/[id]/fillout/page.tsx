import React from 'react';
import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { trpc } from '~/trpc/server';

export default async function Fillout({ params }: { params: { id: string } }) {
  const { id } = params;
  const user = await auth();

  const survey = await trpc.survey.byId({ id: Number(id) });

  if (!survey) {
    return redirect(`/survey/${id}/share`);
  }

  redirect(`${survey.link}?start_time=${new Date().getTime()}`);

  return (
    <div className='flex min-h-screen items-center justify-center bg-[#DDEBF7]'>
      <div className='relative inline-flex'>
        <div className='h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent'></div>
      </div>
    </div>
  );
}
