'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <main className='flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary to-secondary p-4 text-white md:p-24'>
      <div className='flex w-full max-w-3xl grow flex-col items-center justify-center rounded-lg bg-white/10 p-6 shadow-lg'>
        <h1 className='mb-4 text-3xl font-bold tracking-tight'>Oops! Something went wrong</h1>
        <p className='text-xl'>{error.message}</p>
      </div>
      <div className='flex flex-col items-center gap-4 text-center'>
        {/*<p className='text-sm text-gray-300'>Okwu ID & Ozo Run Club Team</p>*/}
        <Image src='/powered-by-genus.png' alt='Mount Motherland 2025' width={200} height={100} />
      </div>
    </main>
  );
}
