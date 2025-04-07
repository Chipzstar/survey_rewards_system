'use client';

import { RouterOutput } from '~/lib/trpc';
import Link from 'next/link';
import { FC } from 'react';
import { AlertCircle, Gift } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip';
import { cn } from '~/lib/utils';
import { Button } from '~/components/ui/button';

export const SurveyListCard: FC<{ survey: RouterOutput['survey']['fromUser'][number]; disabled?: boolean }> = ({
  disabled = false,
  survey
}) => (
  <li key={survey.id} className='mb-4 list-none'>
    <Link
      href={disabled ? '#' : `/survey/${survey.id}`}
      className={`block rounded-md border p-4 shadow-sm transition-colors ${
        disabled
          ? 'cursor-not-allowed border-gray-300 bg-gray-100 opacity-60 dark:border-gray-600 dark:bg-gray-700'
          : 'border-gray-200 bg-white hover:border-primary hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-primary'
      }`}
      onClick={disabled ? e => e.preventDefault() : undefined}
    >
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <span className='text-lg font-medium text-gray-800 dark:text-gray-100'>
            {survey.name}
            {disabled && <span className='ml-2 text-sm text-gray-500'>(Expired)</span>}
          </span>
          {survey.rewards && survey.rewards.length > 0 ? (
            <div className='flex items-center gap-1'>
              <Gift className='h-5 w-5 text-green-500' />
              <span
                className={cn(
                  'flex h-5 items-center justify-center rounded-full bg-green-100 px-2 text-xs font-medium text-green-600',
                  'dark:bg-green-900/30 dark:text-green-400'
                )}
              >
                {survey.rewards.length}
              </span>
            </div>
          ) : (
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger>
                  <AlertCircle className='h-5 w-5 text-yellow-500' />
                </TooltipTrigger>
                <TooltipContent className='flex max-w-xs flex-col gap-2 p-3'>
                  <p className='text-sm'>
                    This survey has no rewards configured. Attendees won't receive any incentives for participation.
                  </p>
                  <Link href={`/survey/${survey.id}/edit`} className='text-primary' passHref>
                    <Button variant='secondary' size='sm' className='w-full'>
                      Add Rewards
                    </Button>
                  </Link>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 20 20'
          fill='currentColor'
          className='h-5 w-5 text-gray-500 dark:text-gray-400'
        >
          <path
            fillRule='evenodd'
            d='M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z'
            clipRule='evenodd'
          />
        </svg>
      </div>
      <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>{survey.description}</p>
    </Link>
  </li>
);
