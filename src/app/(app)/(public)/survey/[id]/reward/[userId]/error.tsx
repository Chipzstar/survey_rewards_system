'use client';

import { useEffect } from 'react';
import { Button } from '~/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const searchParams = useSearchParams();
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className='flex h-[calc(100vh-4rem)] flex-col items-center justify-center gap-4'>
      <h2 className='text-2xl font-bold text-red-600'>Sorry your user ID does not exist</h2>
      <p className='text-neutral-600'>Please contact a member from the Genus team to support you</p>
      <div className='flex gap-4'>
        <Button onClick={() => reset()} variant='outline'>
          User ID: {searchParams.get('userId')}
        </Button>
      </div>
    </div>
  );
}
