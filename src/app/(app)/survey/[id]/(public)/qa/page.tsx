import React from 'react';
import { HydrateClient, trpc } from '~/trpc/server';
import QAForm from './qa-form';

export default async function SurveyPage({ params }: { params: { id: string } }) {
  const survey = await trpc.survey.byIdWithEvent({ id: Number(params.id) });

  if (!survey.event) throw new Error('Event not found');

  return (
    <HydrateClient>
      <main className='flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary to-secondary p-4 text-white md:p-24'>
        <div className='w-full max-w-lg space-y-8 rounded-lg bg-white/10 p-6 backdrop-blur-sm'>
          <div className='space-y-2 text-center'>
            <h1 className='text-3xl font-bold tracking-tight'>{survey.event.name}</h1>
          </div>
          <QAForm surveyId={survey.id} />
        </div>
      </main>
    </HydrateClient>
  );
}
