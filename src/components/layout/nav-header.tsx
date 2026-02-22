'use client';

import { UserButton } from '@clerk/nextjs';
import { Input } from '~/components/ui/input';
import { FC } from 'react';
import { useIsMobile } from '~/hooks/use-mobile';
import { Menu, Search } from 'lucide-react';
import { SidebarTrigger } from '~/components/ui/sidebar';
import Link from 'next/link';
import { useSearch } from '~/hooks/useSearch';
import { usePathname, useSearchParams } from 'next/navigation';
import { trpc } from '~/trpc/client';
import { format } from 'date-fns';

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

const EVENT_PATH_REGEX = /^\/event\/(\d+)(?:\/|$)/;

export const DashboardHeader: FC<Props> = props => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isMobile = useIsMobile();
  const { isSearching, searchText, setSearchText, onChangeText } = useSearch();

  const eventIdMatch = pathname?.match(EVENT_PATH_REGEX);
  const eventId = eventIdMatch ? Number(eventIdMatch[1]) : null;
  const { data: event } = trpc.event.byId.useQuery(
    { id: eventId! },
    { enabled: eventId != null }
  );

  const title = event ? event.name : `Welcome Back, ${props.firstname ?? 'there'} 👋`;
  const eventSubtext = event
    ? [event.location, event.date ? format(new Date(event.date), 'MMM d, yyyy • h:mm a') : null].filter(Boolean).join(' • ')
    : '';
  const subtext = event ? (eventSubtext || '—') : 'Create engaging surveys and get real feedback effortlessly!';

  return (
    <nav>
      {isMobile && <BrandHeader />}
      <div className='flex w-full items-center justify-between p-6'>
        <div className='flex flex-col'>
          <h1 className='text-2xl font-medium md:text-3xl'>{title}</h1>
          <p className='text-sm font-light text-sub md:text-base md:font-normal'>
            {subtext}
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
