'use client';
import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

const iconButtonVariants = cva(
  'rounded transition flex items-center justify-center shrink-0',
  {
    variants: {
      size: {
        sm: 'h-7 w-7',
        md: 'h-9 w-9',
        lg: 'h-10 w-12',
      },
      use: {
        primary:
          'border border-transparent bg-white text-zinc-800 hover:bg-zinc-100 active:bg-zinc-200 disabled:border disabled:border-zinc-300 disabled:bg-transparent disabled:text-zinc-400 disabled:hover:bg-transparent disabled:hover:text-zinc-400 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700 disabled:dark:border-zinc-600 disabled:dark:bg-transparent disabled:dark:text-zinc-600',
        secondary:
          'border border-zinc-300 bg-white text-zinc-500 hover:border-zinc-400 hover:text-zinc-800 active:border-zinc-500 disabled:!border-zinc-300 disabled:text-zinc-400 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-zinc-500 dark:hover:text-white dark:active:border-zinc-400 disabled:dark:!border-zinc-700 disabled:dark:text-zinc-500',
        tertiary: 'bg-sky-600 text-white hover:bg-sky-700',
        ghost:
          'bg-transparent dark:bg-transparent text-zinc-800 hover:bg-zinc-100 active:bg-zinc-200 dark:text-white dark:hover:bg-zinc-800 dark:active:bg-zinc-700',
      },
    },
  }
);

export interface IconButtonProps
  extends React.DetailedHTMLProps<
      React.ButtonHTMLAttributes<HTMLButtonElement>,
      HTMLButtonElement
    >,
    VariantProps<typeof iconButtonVariants> {}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    { use = 'primary', size = 'md', className, children, ...restProps },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={twMerge(iconButtonVariants({ use, size, className }))}
        {...restProps}
      >
        {children}
      </button>
    );
  }
);
