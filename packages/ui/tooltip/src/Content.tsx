import {
  Arrow,
  Content as RadixContent,
  Portal,
} from '@radix-ui/react-tooltip';
import { ComponentProps } from 'react';

export function Content({
  children,
  sideOffset = 4,
  ...restProps
}: ComponentProps<typeof RadixContent>) {
  return (
    <Portal>
      <RadixContent
        {...restProps}
        sideOffset={sideOffset}
        className="dark:bg-white text-xs font-medium bg-zinc-800 dark:text-zinc-800 text-white rounded-lg z-30 py-2 px-3 shadow motion-safe:data-[side=top]:animate-slide-down-fade motion-safe:data-[side=bottom]:animate-slide-up-fade motion-safe:data-[side=left]:animate-slide-right-fade motion-safe:data-[side=right]:animate-slide-left-fade"
      >
        {children}
        <Arrow className="fill-zinc-800 dark:fill-white" />
      </RadixContent>
    </Portal>
  );
}
