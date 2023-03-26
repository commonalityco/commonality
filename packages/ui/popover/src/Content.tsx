import { Icon } from '@commonalityco/ui-icon';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import * as RadixPopover from '@radix-ui/react-popover';
import clsx from 'clsx';

export interface ContentProps extends RadixPopover.PopoverContentProps {
  isClosable?: boolean;
}

export function Content({
  className,
  children,
  isClosable = true,
  sideOffset = 8,
  ...restProps
}: ContentProps) {
  return (
    <RadixPopover.Portal>
      <RadixPopover.Content
        {...restProps}
        sideOffset={sideOffset}
        className={clsx(
          'rounded px-4 pb-4 w-64 bg-white dark:bg-zinc-900 shadow-md border border-zinc-100 dark:border-zinc-800 font-sans',
          className
        )}
      >
        {children}
        {isClosable && (
          <RadixPopover.Close asChild>
            <button
              className="absolute top-2 right-2 inline-flex items-center justify-center h-6 w-6 rounded hover:bg-zinc-100 active:bg-zinc-200 dark:hover:bg-zinc-800 dark:active:bg-zinc-700"
              aria-label="Close"
            >
              <Icon icon={faClose} className="text-zinc-800 dark:text-white" />
            </button>
          </RadixPopover.Close>
        )}
      </RadixPopover.Content>
    </RadixPopover.Portal>
  );
}
