'use client';
import * as React from 'react';
import { VariantProps, cva } from 'class-variance-authority';
import { cn } from '../utils/cn';
import { labelVariants } from './label';

const tagStyles = cva('inline-flex items-center gap-x-0.5 border truncate', {
  variants: {
    variant: {
      default: 'rounded-md',
      rounded: 'rounded-full',
      icon: 'rounded-md',
    },
    color: {
      transparent: 'bg-transparent text-foreground',
      grey: 'bg-secondary text-secondary-foreground',
      green: 'bg-success text-success-foreground border-success-border',
      red: 'bg-danger text-danger-foreground border-danger-border',
    },
    size: {
      sm: cn('px-1.5', labelVariants({ size: 'xs', weight: 'medium' })),
      md: cn('px-2 py-0.5', labelVariants({ size: 'sm', weight: 'medium' })),
      lg: cn('px-2.5 py-1', labelVariants({ size: 'md', weight: 'medium' })),
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
    color: 'grey',
  },
});

export interface BadgeProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'color'>,
    VariantProps<typeof tagStyles> {}

function Tag({ className, variant, color, size, ...props }: BadgeProps) {
  return (
    <div
      className={cn(tagStyles({ variant, color, size }), className)}
      {...props}
    />
  );
}

export { Tag, tagStyles };
