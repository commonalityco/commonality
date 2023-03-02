import { Item as RadixItem, Indicator } from '@radix-ui/react-radio-group';
import { ComponentProps, useId, forwardRef } from 'react';

interface RadioGroupProps extends ComponentProps<typeof RadixItem> {}

export const Item = forwardRef<HTMLButtonElement, RadioGroupProps>(
  ({ children, ...restProps }, ref) => {
    const id = useId();

    return (
      <div className="flex items-center gap-2">
        <RadixItem
          {...restProps}
          id={id}
          ref={ref}
          className="h-4 w-4 rounded-full border border-zinc-200 dark:border-zinc-500 bg-white dark:bg-zinc-800 p-0 relative data-[state=checked]:border-sky-600 data-[state=unchecked]:hover:border-zinc-400]"
        >
          <Indicator className="h-2 w-2 bg-sky-600 rounded-full block absolute m-auto top-0 bottom-0 left-0 right-0" />
        </RadixItem>
        <label
          className="text-zinc-800 dark:text-white font-medium py-2 px-0 cursor-pointer text-sm"
          htmlFor={id}
        >
          {children}
        </label>
      </div>
    );
  }
);
