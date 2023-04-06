'use client';
import { Trigger } from '@radix-ui/react-tabs';
import clsx from 'clsx';
import { ComponentProps } from 'react';

interface TabProps extends ComponentProps<typeof Trigger> {
  use?: 'primary' | 'secondary';
}

export function Tab({
  children,
  className,
  use = 'primary',
  ...restProps
}: TabProps) {
  return (
    <Trigger
      {...restProps}
      className={clsx(
        'align-center font-regular group relative flex grow-0 cursor-pointer select-none justify-center bg-transparent transition',
        {
          '': use === 'primary',
          'border-l-0 border-t border-r border-zinc-100 bg-zinc-100 first-of-type:border-l hover:bg-zinc-100 active:bg-zinc-200 dark:border-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-800 dark:active:bg-zinc-700':
            use === 'secondary',
        },
        className
      )}
    >
      <div
        className={clsx(
          'flex w-full flex-nowrap items-center text-sm antialiased transition',
          {
            'mb-2 rounded px-6 py-2 text-zinc-500 group-hover:text-zinc-800 dark:text-zinc-400 dark:group-hover:text-white [[data-state=active]_&]:text-zinc-800 dark:[[data-state=active]_&]:text-white':
              use === 'primary',
            'truncate px-6 py-2 text-zinc-500 dark:text-zinc-400 [[data-state=active]_&]:bg-white [[data-state=active]_&]:text-zinc-800 dark:[[data-state=active]_&]:bg-zinc-900 dark:[[data-state=active]_&]:text-white':
              use === 'secondary',
          }
        )}
      >
        {children}
      </div>
      <span
        className={clsx('transition', {
          'absolute -bottom-px h-0.5 w-full bg-zinc-800 opacity-0 dark:bg-white [[data-state=active]_&]:opacity-100':
            use === 'primary',
          'absolute -bottom-px h-0.5 w-full bg-white opacity-0 dark:bg-zinc-900 [[data-state=active]_&]:opacity-100':
            use === 'secondary',
        })}
      />
    </Trigger>
  );
}
