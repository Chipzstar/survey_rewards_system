import React from 'react';

interface Props {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: Props) => {
  return (
    <main className='flex min-h-screen items-center justify-center bg-gradient-to-r from-teal-500 via-primary to-purple-300 p-6 text-white md:px-4 md:py-8'>
      {children}
    </main>
  );
};

export default AuthLayout;
