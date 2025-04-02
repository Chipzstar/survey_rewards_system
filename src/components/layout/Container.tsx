import React, { FC, PropsWithChildren } from 'react';

const Container: FC<PropsWithChildren> = ({ children }) => {
  return (
    <main className='flex grow flex-col p-6 pb-12 sm:h-full lg:px-12 lg:py-6 xl:px-12 xl:pb-12 2xl:px-24'>
      {children}
    </main>
  );
};

export default Container;
