'use client';
import * as Primitives from '@radix-ui/react-label';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '../utils/cn';

export const labelVariants = cva('font-sans', {
  variants: {
    size: {
      xs: 'text-xs leading-5',
      sm: 'text-[13px] leading-5',
      md: 'text-sm leading-5',
      lg: 'text-base leading-5',
    },
    weight: {
      normal: 'font-normal',
      medium: 'font-medium',
    },
  },
  defaultVariants: {
    size: 'md',
    weight: 'normal',
  },
});

interface LabelProps
  extends React.ComponentPropsWithoutRef<'label'>,
    VariantProps<typeof labelVariants> {}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, size = 'md', weight = 'medium', ...props }, ref) => {
    return (
      <Primitives.Root
        ref={ref}
        className={cn(labelVariants({ size, weight }), className)}
        {...props}
      />
    );
  }
);
