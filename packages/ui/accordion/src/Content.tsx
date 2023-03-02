import { Content as RadixContent } from '@radix-ui/react-accordion';
import { ComponentProps, forwardRef } from 'react';

import { cva } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

const triggerClassName = cva([
  'p-3 overflow-auto',
  '[[data-state=closed]_&]:animate-accordion-slide-up',
  '[[data-state=open]_&]:animate-accordion-slide-down',
]);

interface ContentProps extends ComponentProps<typeof RadixContent> {}

export const Content = forwardRef<HTMLDivElement, ContentProps>(
  ({ children, className, ...props }, forwardedRef) => (
    <div className="shrink overflow-auto">
      <RadixContent
        className={twMerge(triggerClassName({ className }))}
        {...props}
        ref={forwardedRef}
      >
        {children}
      </RadixContent>
    </div>
  )
);
