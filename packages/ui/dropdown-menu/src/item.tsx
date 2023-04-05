'use client';
import { Item as RadixItem } from '@radix-ui/react-dropdown-menu';
import { ComponentProps } from 'react';
import { twMerge } from 'tailwind-merge';
import { itemClassname } from './itemClassname';

export const Item = (props: ComponentProps<typeof RadixItem>) => {
  return (
    <RadixItem
      {...props}
      className={twMerge(itemClassname, 'whitespace-nowrap')}
    />
  );
};
