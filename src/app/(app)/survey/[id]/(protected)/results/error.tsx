'use client';

import { useEffect } from 'react';
import { Button } from '~/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className='flex h-[calc(100vh-4rem)] flex-col items-center justify-center gap-6'>
      <h2 className='text-2xl font-bold text-red-600'>Please add a gift card to the survey to see results!</h2>
      <div className='flex gap-4'>
        <Button onClick={() => router.push(`/survey/${searchParams.get('id')}/edit`)} variant='outline'>
          Add a Gift Card
        </Button>
        <Button onClick={() => router.push('/')} variant='default'>
          Return Home
        </Button>
      </div>
    </div>
  );
}
