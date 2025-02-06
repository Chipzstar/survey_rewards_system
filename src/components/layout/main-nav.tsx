'use client';

import Link from 'next/link';
import { cn } from '~/lib/utils';
import { FC } from 'react';
import { usePathname } from 'next/navigation'; // Add this import

interface Props {
  surveyId: number;
  className?: string;
}

export const MainNav: FC<Props> = ({ className, surveyId }) => {
  const pathname = usePathname(); // Get current path

  return (
    <nav
      className={cn(
        'flex items-center gap-1 rounded-lg bg-white/50 p-1 shadow-sm backdrop-blur-sm md:rounded-full',
        className
      )}
    >
      {[
        { href: `/survey/${surveyId}`, label: 'Leaderboard' },
        { href: `/survey/${surveyId}/analytics`, label: 'Analytics' },
        { href: `/survey/${surveyId}/edit`, label: 'Edit' },
        { href: `/survey/${surveyId}/share`, label: 'Share' },
        { href: `/survey/${surveyId}/results`, label: 'Results' }
      ].map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            'rounded-lg px-3 py-2 text-xs font-medium transition-all duration-200 sm:px-4 md:rounded-full md:text-sm',
            'truncate text-ellipsis hover:bg-gray-100 hover:shadow-sm',
            pathname === href ? 'bg-white text-primary shadow-sm' : 'text-gray-600'
          )}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
};
