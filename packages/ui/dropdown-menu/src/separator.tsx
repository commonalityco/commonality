'use client';
import { Separator as RadixSeparator } from '@radix-ui/react-dropdown-menu';
import { ComponentProps } from 'react';

export const Separator = (props: ComponentProps<typeof RadixSeparator>) => {
  return (
    <RadixSeparator
      {...props}
      className="h-px bg-zinc-200 dark:bg-zinc-600 my-2"
    />
  );
};
