// src/app/(app)/survey/layout.tsx
import { FC, PropsWithChildren } from 'react';
import { MainNav } from '~/components/layout/main-nav';
import { trpc } from '~/trpc/server';
import { Button } from '~/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

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
      <div className='mb-4 flex w-full flex-col items-center gap-y-4 sm:flex-row sm:justify-between md:mb-8'>
        <aside className='flex items-center md:space-x-8'>
          <Button asChild variant='link'>
            <Link href='/' className='flex space-x-2 text-white'>
              <ArrowLeft />
              <span className='md:text-lg'>Back</span>
            </Link>
          </Button>
          <h1 className='text-center text-2xl font-bold tracking-tight text-white md:text-4xl'>{survey.name}</h1>
        </aside>
        <MainNav surveyId={surveyId} />
      </div>
      <main className='flex h-full w-full grow flex-col overflow-y-auto'>{children}</main>
    </main>
  );
}
