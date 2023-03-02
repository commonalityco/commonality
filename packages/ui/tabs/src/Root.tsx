'use client';
import { Root as RadixRoot } from '@radix-ui/react-tabs';
import clsx from 'clsx';
import { ComponentProps } from 'react';

interface RootProps extends ComponentProps<typeof RadixRoot> {}

export function Root({ children, className, ...restProps }: RootProps) {
  return (
    <RadixRoot {...restProps} className={clsx('flex flex-col', className)}>
      {children}
    </RadixRoot>
  );
}
