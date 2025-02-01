import React, { FC } from 'react';
import Image from 'next/image';

interface Props {}

export default function Loader({ display = true }: { display: boolean }) {
  if (!display) return <></>;

  return (
    <div className='fixed inset-0 z-[9999] h-full w-full bg-gray-900/80'>
      <div className='absolute bottom-1/2 right-1/2 translate-x-1/2 translate-y-1/2'>
        <div id='spinner-trail' className='relative inline-block h-20 w-20'>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
      <div className='h-18 w-18 absolute bottom-[calc(50%-12px)] right-[calc(50%-16px)] block translate-x-1/2 translate-y-1/2'>
        <Image
          src='/logo.png'
          alt='Genus Logo'
          fill
          sizes='100vw'
          style={{ objectFit: 'contain' }}
          className='rounded-full'
        />
      </div>
    </div>
  );
}
