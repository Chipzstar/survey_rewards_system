// src/app/(app)/survey/layout.tsx
import { FC, PropsWithChildren } from 'react';
import { MainNav } from '~/components/layout/main-nav';
import { trpc } from '~/trpc/server';

interface Props extends PropsWithChildren {
  params: {
    id: string;
  };
}

export default async function SurveyLayout({ children, params }: Props) {
  const surveyId = parseInt(params.id);
  const survey = await trpc.survey.byIdWithAnalytics({ id: Number(params.id) });

  if (!survey) {
    return null; // Or handle the error appropriately
  }

  return (
    <main className='flex min-h-screen flex-col items-center bg-gradient-to-br from-primary to-secondary p-4 sm:h-screen xl:p-12 2xl:p-24'>
      <div className='mb-4 flex w-full flex-col items-center gap-4 sm:flex-row sm:justify-between md:mb-8'>
        <h1 className='text-center text-3xl font-bold tracking-tight text-white md:text-4xl'>{survey.name}</h1>
        <MainNav surveyId={surveyId} />
      </div>
      <main className='flex h-full w-full grow flex-col overflow-y-auto'>{children}</main>
    </main>
  );
}
