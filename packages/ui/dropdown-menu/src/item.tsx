'use client';
import { Item as RadixItem } from '@radix-ui/react-dropdown-menu';
import clsx from 'clsx';
import { ComponentProps } from 'react';
import { itemClassname } from './itemClassname';

export const Item = (props: ComponentProps<typeof RadixItem>) => {
  return (
    <RadixItem
      {...props}
      className={clsx(itemClassname, 'whitespace-nowrap')}
    />
  );
};
