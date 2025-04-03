import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '~/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center border border-neutral-200 px-2.5 py-0.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 dark:border-neutral-800 dark:focus:ring-neutral-300',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-neutral-900 text-neutral-50 hover:bg-neutral-900/80 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-50/80',
        secondary:
          'border-transparent bg-neutral-100 text-neutral-900 hover:bg-neutral-100/80 dark:bg-neutral-800 dark:text-neutral-50 dark:hover:bg-neutral-800/80',
        destructive:
          'border-transparent bg-red-500 text-neutral-50 hover:bg-red-500/80 dark:bg-red-900 dark:text-neutral-50 dark:hover:bg-red-900/80',
        outline: 'text-neutral-950 dark:text-neutral-50',
        active: 'bg-success-50 text-success-700 dark:bg-green-900 dark:text-green-300 border-success-200',
        completed: 'bg-gray-50 text-gray-700 dark:bg-gray-900 dark:text-gray-300',
        upcoming: 'bg-warning-50 text-warning-600 dark:bg-orange-900 dark:text-orange-300 border-warning-200',
        error: 'bg-red-50 text-red-700 dark:bg-red-900 dark:text-red-300 border-red-200'
      },
      radius: {
        none: 'rounded-none',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        xl: 'rounded-xl',
        full: 'rounded-full'
      }
    },
    defaultVariants: {
      variant: 'default',
      radius: 'full'
    }
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, radius, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant, radius }), className)} {...props} />;
}

export { Badge, badgeVariants };
