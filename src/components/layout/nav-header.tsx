'use client';

import { UserButton } from '@clerk/nextjs';
import { Input } from '~/components/ui/input';
import { CreateEventDialog } from '~/components/modals/create-event-dialog';
import { FC } from 'react';
import { useIsMobile } from '~/hooks/use-mobile';
import { Search } from 'lucide-react';

interface Props {
  userId: string;
  firstname: string | null;
}
export const DashboardHeader: FC<Props> = props => {
  const isMobile = useIsMobile();
  return (
    <div className='flex w-full items-center justify-between p-6'>
      <div className='flex flex-col'>
        <h1 className='text-2xl font-medium md:text-3xl'>Welcome Back, {props.firstname} 👋</h1>
        <p className='text-sm font-light text-sub md:text-base md:font-normal'>
          Create engaging surveys and get real feedback effortlessly!
        </p>
      </div>
      <div className='flex items-center space-x-4'>
        {isMobile ? (
          <Search size={24} color='black' strokeWidth={1} />
        ) : (
          <Input type='search' placeholder='Search' className='max-w-64 sm:w-64' />
        )}
        <UserButton />
      </div>
    </div>
  );
};
