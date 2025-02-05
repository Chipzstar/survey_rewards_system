'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <main className='flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary to-secondary p-4 text-white md:p-24'>
      <div className='flex w-full max-w-3xl flex-col items-center rounded-lg bg-white/10 p-6 shadow-lg'>
        <h2 className='mb-4 text-center text-3xl font-bold drop-shadow-md md:text-4xl'>Aw unlucky...next time 🥺</h2>
        <p className='mb-6 text-center text-2xl'>Looks like someone just beat you to it...</p>
        <p className='text-center text-xl'>We truly appreciate your contribution, though—thank you!</p>
      </div>
    </main>
  );
}
