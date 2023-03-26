'use client';
import { forwardRef, useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Spinner } from '@commonalityco/ui-spinner';
import useSize from '@react-hook/size';
import { cva, type VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

export const buttonStyles = cva(
  'align-center rounded cursor-pointer font-sans font-medium p-0 disabled:cursor-not-allowed antialiased min-w-6 flex items-center justify-center truncate transition',
  {
    variants: {
      use: {
        primary:
          'border border-transparent bg-zinc-800 text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-800 dark:hover:bg-zinc-100 disabled:bg-transparent disabled:dark:bg-transparent disabled:text-zinc-400 disabled:dark:text-zinc-600 disabled:hover:bg-transparent disabled:hover:text-zinc-400 disabled:border disabled:border-zinc-100 disabled:dark:border-zinc-800',
        secondary:
          'bg-white dark:bg-zinc-900 text-zinc-800 dark:text-white border border-zinc-100 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-500 active:border-zinc-500 dark:active:border-zinc-400 disabled:text-zinc-400 disabled:dark:text-zinc-500 disabled:!border-zinc-100 disabled:dark:!border-zinc-700',
        tertiary: 'bg-sky-600 text-white hover:bg-sky-700',
        danger: 'bg-red-600 text-white hover:bg-red-700',
        ghost:
          'bg-transparent text-zinc-800 hover:bg-zinc-100 active:bg-zinc-200 dark:hover:bg-zinc-800 dark:active:bg-zinc-700 dark:text-white',
      },
      size: {
        sm: 'py-0 px-3 h-7 text-sm',
        md: 'py-0 px-4 h-9 text-sm',
        lg: 'py-0 px-5 h-10 text-base',
      },
    },
  }
);

export interface ButtonProps
  extends React.DetailedHTMLProps<
      React.ButtonHTMLAttributes<HTMLButtonElement>,
      HTMLButtonElement
    >,
    VariantProps<typeof buttonStyles> {
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      use = 'primary',
      size = 'md',
      loading = false,
      className,
      disabled,
      ...props
    }: ButtonProps,
    ref
  ) => {
    const [controlledWidth, setControlledWidth] = useState<number | null>(null);
    const target = useRef(null);
    const [width] = useSize(target);

    useEffect(() => {
      if (!controlledWidth && target.current) {
        setControlledWidth(width);
      }
    }, [target.current, width]);

    return (
      <AnimatePresence>
        <button
          {...props}
          disabled={disabled || loading}
          ref={ref}
          style={controlledWidth ? { width: controlledWidth } : undefined}
          className={twMerge(buttonStyles({ use, size, className }))}
        >
          {loading ? (
            <Spinner use={use} disabled={disabled || loading} />
          ) : (
            children
          )}
        </button>
      </AnimatePresence>
    );
  }
);
