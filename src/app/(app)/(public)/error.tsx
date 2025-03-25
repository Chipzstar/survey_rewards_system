'use client';

import { useEffect } from 'react';
import { Button } from '~/components/ui/button';
import { useRouter } from 'next/navigation';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const router = useRouter();
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className='flex h-[calc(100vh-4rem)] flex-col items-center justify-center gap-4'>
      <h2 className='text-2xl font-bold text-red-600'>Something went wrong!</h2>
      <p className='text-neutral-600'>An error occurred while processing your request</p>
      <div className='flex gap-4'>
        <Button onClick={() => reset()} variant='outline'>
          Try again
        </Button>
        <Button onClick={() => router.push('/')} variant='default'>
          Return Home
        </Button>
      </div>
    </div>
  );
}
