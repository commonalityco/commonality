'use client';
import { Content as RadixContent, Portal } from '@radix-ui/react-dropdown-menu';
import { ComponentProps, forwardRef } from 'react';
import clsx from 'clsx';
import { contentClassname } from './contentClassname';

export const Content = forwardRef<
  HTMLDivElement,
  ComponentProps<typeof RadixContent>
>(({ children, sideOffset = 8, className, ...props }, ref) => {
  return (
    <Portal>
      <RadixContent
        {...props}
        ref={ref}
        sideOffset={sideOffset}
        className={clsx(contentClassname, className)}
      >
        {children}
      </RadixContent>
    </Portal>
  );
});
