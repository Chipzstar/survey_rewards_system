'use client';

import { UserButton } from '@clerk/nextjs';
import { Input } from '~/components/ui/input';
import { CreateEventDialog } from '~/components/modals/create-event-dialog';
import { FC } from 'react';
import { useIsMobile } from '~/hooks/use-mobile';
import { Menu, Search } from 'lucide-react';
import { SidebarTrigger } from '~/components/ui/sidebar';
import Link from 'next/link';
import { useSearch } from '~/hooks/useSearch';
import { useSearchParams } from 'next/navigation';

interface Props {
  userId: string;
  firstname: string | null;
}

const BrandHeader: FC = () => {
  return (
    <div className='flex items-center justify-between px-6 pt-2'>
      <Link href='/'>
        <div className='flex items-center space-x-2' role='button'>
          <img src='/logo.png' alt='Genus Logo' className='h-8 w-8' /> {/* Update with your logo path */}
          <span className='text-lg font-semibold'>Genus</span>
        </div>
      </Link>
      <SidebarTrigger>
        <Menu size={24} color='black' strokeWidth={1} className='cursor-pointer' />
      </SidebarTrigger>
    </div>
  );
};

export const DashboardHeader: FC<Props> = props => {
  const searchParams = useSearchParams();
  const isMobile = useIsMobile();
  const { isSearching, searchText, setSearchText, onChangeText } = useSearch();
  return (
    <nav>
      {isMobile && <BrandHeader />}
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
            <Input
              type='search'
              placeholder='Search'
              className='max-w-64 sm:w-64'
              defaultValue={searchParams.get('query')?.toString()}
              onChange={e => onChangeText(e.target.value)}
            />
          )}
          <UserButton />
        </div>
      </div>
    </nav>
  );
};
