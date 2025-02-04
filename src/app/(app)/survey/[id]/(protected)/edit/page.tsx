// src/app/(app)/survey/[id]/edit/page.tsx
import { auth } from '@clerk/nextjs/server';
import { HydrateClient, trpc } from '~/trpc/server';
import { EditSurveyForm } from './edit-survey-form';
import { redirect } from 'next/navigation';

export default async function EditSurveyPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const user = await auth();

  const survey = await trpc.survey.byIdWithAnalytics({ id: Number(id) });

  if (!survey) {
    redirect('/');
  }

  return (
    <HydrateClient>
      <div className='mx-auto'>
        <EditSurveyForm survey={survey} />
      </div>
    </HydrateClient>
  );
}
