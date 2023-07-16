'use client';
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../utils/cn';
import { labelVariants } from './label';

export const buttonVariants = cva(
  'inline-flex justify-center items-center rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 whitespace-nowrap',
  {
    variants: {
      variant: {
        default:
          'text-primary-foreground border border-transparent bg-primary shadow-sm hover:bg-accent',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        secondary:
          'border shadow-sm hover:bg-secondary text-foreground hover:border-input',
        ghost:
          'border border-transparent hover:shadow-sm hover:bg-secondary text-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        sm: cn(
          'gap-x-0.5 px-2.5 leading-8 h-8',
          labelVariants({ size: 'xs', weight: 'medium' })
        ),
        md: cn(
          'gap-x-1.5 px-3 leading-9 h-9',
          labelVariants({ size: 'sm', weight: 'medium' })
        ),
        lg: cn(
          'gap-x-2 px-4 leading-10 h-10',
          labelVariants({ size: 'md', weight: 'medium' })
        ),
        xl: cn(
          'gap-x-2 px-5 leading-11 h-11',
          labelVariants({
            size: 'lg',
            weight: 'medium',
          })
        ),
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button };
