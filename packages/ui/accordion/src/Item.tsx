import { Item as RadixItem } from '@radix-ui/react-accordion';
import { cva } from 'class-variance-authority';
import { ComponentProps } from 'react';
import { twMerge } from 'tailwind-merge';

const style = cva('relative flex flex-col data-[state="open"]:grow');

export const Item = ({
  className,
  ...props
}: ComponentProps<typeof RadixItem>) => {
  return <RadixItem {...props} className={twMerge(style({ className }))} />;
};
