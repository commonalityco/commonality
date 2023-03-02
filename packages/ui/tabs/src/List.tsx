'use client';
import { List as RadixList } from '@radix-ui/react-tabs';
import clsx from 'clsx';
import { ComponentProps } from 'react';

interface ListProps extends ComponentProps<typeof RadixList> {
  use?: 'primary' | 'secondary';
}

export function List({
  children,
  className,
  use = 'primary',
  ...restProps
}: ListProps) {
  return (
    <RadixList
      {...restProps}
      className={clsx(
        'grid grid-flow-col w-auto',
        {
          'auto-cols-min': use === 'primary',
          'grid-cols-tab-list auto-cols-tab-list': use === 'secondary',
        },
        className
      )}
    >
      {children}
    </RadixList>
  );
}
