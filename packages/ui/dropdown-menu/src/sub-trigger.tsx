'use client';
import { SubTrigger as RadixSubTrigger } from '@radix-ui/react-dropdown-menu';
import { ComponentProps } from 'react';
import { itemClassname } from './itemClassname';

export const SubTrigger = (props: ComponentProps<typeof RadixSubTrigger>) => {
  return <RadixSubTrigger {...props} className={itemClassname} />;
};
