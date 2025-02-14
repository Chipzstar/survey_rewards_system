import * as React from 'react';
import { cn } from '~/lib/utils';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react'; // Import the spinner icon

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background focus-visible:ring-offset-0',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'bg-transparent border border-input hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary-600 text-secondary-foreground hover:bg-secondary/80',
        tertiary: 'bg-tertiary-600 text-secondary-foreground hover:bg-tertiary-600/80',
        ghost: 'bg-transparent hover:bg-accent hover:text-accent-foreground',
        link: 'bg-transparent underline-offset-4 hover:underline text-primary'
      },
      size: {
        default: 'h-10 py-2 px-4',
        sm: 'h-9 px-3 rounded-md',
        lg: 'h-11 px-8 rounded-md text-base',
        xl: 'h-12 px-10 rounded-md text-lg',
        icon: 'h-10 w-10'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean; // Add loading prop
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, isLoading = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} disabled={isLoading} {...props}>
        {isLoading ? (
          <>
            {children}
            <Loader2 className='ml-2 h-4 w-4 animate-spin' />
          </>
        ) : (
          children
        )}
      </Comp>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
