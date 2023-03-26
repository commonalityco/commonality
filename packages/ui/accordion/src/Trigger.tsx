import {
  Trigger as RadixTrigger,
  Header as RadixHeader,
} from '@radix-ui/react-accordion';
import { ComponentProps, forwardRef } from 'react';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import { cva, type VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

const triggerClassName = cva(
  'font-sans flex flex-nowrap group justify-between p-3 items-center w-full shrink-0 text-zinc-800 dark:text-white font-medium text-sm'
);

interface TriggerProps extends ComponentProps<typeof RadixTrigger> {}

export const Trigger = forwardRef<HTMLButtonElement, TriggerProps>(
  ({ children, className, ...props }, forwardedRef) => (
    <RadixHeader>
      <RadixTrigger
        className={twMerge(triggerClassName({ className }))}
        {...props}
        ref={forwardedRef}
      >
        {children}
        <div className="group-hover:bg-zinc-100 dark:group-hover:bg-zinc-800 rounded h-5 w-5 flex items-center justify-center transition">
          <ChevronDownIcon
            className="transition [[data-state=open]_&]:rotate-180"
            aria-hidden
          />
        </div>
      </RadixTrigger>
    </RadixHeader>
  )
);
