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
        <h2 className='mb-4 text-center text-3xl font-bold drop-shadow-md md:text-4xl'>Aw unlucky...next time 🥺</h2>
        <p className='mb-6 text-center text-2xl'>Looks like someone just beat you to it...</p>
        <p className='text-center text-xl'>We truly appreciate your contribution, though — thank you!</p>
      </div>
      <div className='flex flex-col items-center gap-4 text-center'>
        <p className='mt-4 text-sm text-gray-300'>Mount Motherland 2025</p>
        {/*<p className='text-sm text-gray-300'>Okwu ID & Ozo Run Club Team</p>*/}
        <Image src='/powered-by-genus.png' alt='Mount Motherland 2025' width={200} height={100} />
      </div>
    </main>
  );
}
