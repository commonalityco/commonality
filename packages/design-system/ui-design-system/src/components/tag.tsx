import * as React from 'react';
import { VariantProps, cva } from 'class-variance-authority';
import { cn } from '../utils/cn';

const tagStyles = cva(
  'inline-flex border rounded-full px-2.5 py-0.5 text-xs font-regular transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 truncate items-center min-w-fit',
  {
    variants: {
      use: {
        default:
          'bg-primary hover:bg-primary/80 border-transparent text-primary-foreground',
        secondary:
          'bg-secondary hover:bg-secondary/80 border-transparent text-secondary-foreground',
        destructive:
          'bg-destructive hover:bg-destructive/80 border-transparent text-destructive-foreground',
        outline: 'text-foreground border-input',
      },
    },
    defaultVariants: {
      use: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof tagStyles> {}

function Tag({ className, use, ...props }: BadgeProps) {
  return <div className={cn(tagStyles({ use }), className)} {...props} />;
}

export { Tag, tagStyles };
