'use client';
import { Label as RadixLabel } from '@radix-ui/react-dropdown-menu';
import { ComponentProps } from 'react';

export const Label = (props: ComponentProps<typeof RadixLabel>) => {
  return (
    <RadixLabel
      {...props}
      className="text-sm pt-1 px-4 pb-2 text-zinc-800 dark:text-white"
    />
  );
};
