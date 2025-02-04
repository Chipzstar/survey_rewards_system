'use client';

import React, { useState } from 'react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';

export default function CheckWinnerPage() {
  const [passcode, setPasscode] = useState('');

  const handleSubmit = () => {
    // Handle passcode submission logic here
    console.log('Passcode:', passcode);
  };

  return (
    <main className='flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary to-secondary p-4 text-white md:p-24'>
      <div className='flex max-w-3xl flex-col items-center rounded-lg bg-white/10 p-6 shadow-lg'>
        <h2 className='mb-4 text-center text-3xl font-bold drop-shadow-md md:text-4xl'>
          Congratulations... you have been selected as a Gift Card Winner 🎉
        </h2>
        <p className='mb-6 text-center text-2xl'>First person to claim wins the Gift Card!!</p>
        <p className='mb-2 text-center text-xl'>Enter your unique passcode to win:</p>
        <Input
          type='text'
          placeholder='Your Passcode'
          className='mb-4 w-fit text-black'
          value={passcode}
          onChange={e => setPasscode(e.target.value)}
        />
        <Button variant='tertiary' onClick={handleSubmit}>
          Did you win 👀...
        </Button>
        <p className='mt-4 text-sm text-gray-300'>The Mount Motherland 2025</p>
        <p className='mt-4 text-xs text-gray-300'>Powered by Genus</p>
      </div>
    </main>
  );
}
