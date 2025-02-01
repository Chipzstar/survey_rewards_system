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
    <nav className={cn('flex items-center gap-1 rounded-full bg-white/50 p-1 shadow-sm backdrop-blur-sm', className)}>
      {[
        { href: '/', label: 'Home' },
        { href: `/survey/${surveyId}`, label: 'Analytics' },
        { href: `/survey/${surveyId}/edit`, label: 'Edit' },
        { href: `/survey/${surveyId}/share`, label: 'Share' },
        { href: `/survey/${surveyId}/winner`, label: 'Results' }
      ].map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            'rounded-full px-4 py-2 text-sm font-medium transition-all duration-200',
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
