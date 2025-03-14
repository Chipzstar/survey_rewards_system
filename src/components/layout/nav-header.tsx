'use client';

import { UserButton } from '@clerk/nextjs';
import { Input } from '~/components/ui/input';
import { CreateEventDialog } from '~/components/modals/create-event-dialog';
import { FC } from 'react';

interface Props {
  userId: string;
  firstname: string | null;
}
export const DashboardHeader: FC<Props> = props => {
  return (
    <div className='flex w-full items-center justify-between p-6'>
      <div className='flex flex-col'>
        <h1 className='text-3xl font-medium'>Welcome Back, {props.firstname} 👋</h1>
        <p className='text-sub'>Create engaging surveys and get real feedback effortlessly!</p>
      </div>
      <div className='flex items-center space-x-4'>
        <Input type='search' placeholder='Search' className='w-64' />
        <UserButton afterSignOutUrl='/' />
      </div>
    </div>
  );
};

export const DashboardActions = () => {
  return (
    <div className='flex items-center justify-start space-x-4 p-6'>
      <CreateEventDialog />
    </div>
  );
};
