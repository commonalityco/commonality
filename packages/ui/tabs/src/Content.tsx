'use client';
import { Content as RadixContent } from '@radix-ui/react-tabs';
import { ComponentProps } from 'react';

interface ContentProps extends ComponentProps<typeof RadixContent> {}

export function Content({ children, ...restProps }: ContentProps) {
  return (
    <RadixContent {...restProps} className="grow focus:shadow-md">
      {children}
    </RadixContent>
  );
}
