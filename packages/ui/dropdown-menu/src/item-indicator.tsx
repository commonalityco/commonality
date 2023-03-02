'use client';
import { ItemIndicator as RadixItemIndicator } from '@radix-ui/react-dropdown-menu';
import { ComponentProps } from 'react';

export const ItemIndicator = (
  props: ComponentProps<typeof RadixItemIndicator>
) => {
  return <RadixItemIndicator {...props} className="ml-auto pl-4" />;
};
