'use client';
import { RadioItem as RadixRadioItem } from '@radix-ui/react-dropdown-menu';
import { ComponentProps } from 'react';
import { itemClassname } from './itemClassname';

export const RadioItem = (props: ComponentProps<typeof RadixRadioItem>) => {
  return <RadixRadioItem {...props} className={itemClassname} />;
};
