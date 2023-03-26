import { ComponentProps } from 'react';
import Link from 'next/link';
import clsx from 'clsx';

export interface RootProps extends ComponentProps<typeof Link> {}

export function Root({ children, className, ...restProps }: RootProps) {
  return (
    <Link
      {...restProps}
      className={clsx(
        'transition relative font-sans w-full border border-solid border-zinc-100 dark:border-zinc-800 rounded cursor-pointer no-underline hover:shadow-md hover:border-zinc-400 dark:hover:border-zinc-500 active:border-zinc-500 dark:active:border-zinc-400',
        className
      )}
    >
      {children}
    </Link>
  );
}
