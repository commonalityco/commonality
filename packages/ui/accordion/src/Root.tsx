import { Root as RadixRoot } from '@radix-ui/react-accordion';
import { cva } from 'class-variance-authority';
import { ComponentProps } from 'react';
import { twMerge } from 'tailwind-merge';

const style = cva('flex flex-col');

export const Root = ({
  className,
  ...props
}: ComponentProps<typeof RadixRoot>) => {
  return <RadixRoot {...props} className={twMerge(style({ className }))} />;
};
