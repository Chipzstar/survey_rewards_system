'use client';

import { useState } from 'react';
import { Button } from '~/components/ui/button';
import Link from 'next/link';
import { SurveyCreator, SurveyCreatorComponent } from 'survey-creator-react';
import 'survey-core/defaultV2.min.css';
import 'survey-creator-core/survey-creator-core.min.css';

export default function CreateSurveyPage() {
  const [surveyJson, setSurveyJson] = useState(null);

  const creatorOptions = {
    showLogicTab: true,
    isAutoSave: true
  };

  const SSR = typeof window === 'undefined';
  let creator: SurveyCreator;
  if (!SSR) {
    creator = new SurveyCreator(creatorOptions);
  }

  return (
    <main className='flex min-h-screen flex-col items-center bg-[#F3F3F3] pb-4 text-white sm:h-screen'>
      <div className='flex h-full w-full flex-col items-center'>
        <div className='h-full w-full text-black'>{!SSR && <SurveyCreatorComponent creator={creator} />}</div>
        {surveyJson && (
          <div className='mt-4'>
            <h2 className='mb-2 text-2xl font-bold'>Survey JSON:</h2>
            <pre className='overflow-x-auto rounded-md bg-gray-800 p-4'>
              <code>{JSON.stringify(surveyJson, null, 2)}</code>
            </pre>
          </div>
        )}
        <div className='mt-4'>
          <Button asChild>
            <Link href='/dashboard'>Done</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
