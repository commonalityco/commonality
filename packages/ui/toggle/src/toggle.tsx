import { ComponentProps } from 'react';
import * as Switch from '@radix-ui/react-switch';

export interface ToggleProps extends ComponentProps<typeof Switch.Root> {}

export const Toggle = ({ ...restProps }: ToggleProps) => {
  return (
    <Switch.Root
      {...restProps}
      className="w-10 h-6 bg-zinc-100 dark:bg-zinc-800 cursor-pointer relative transition border border-zinc-100 dark:border-zinc-500 rounded-full data-[state=checked]:!bg-sky-600 data-[state=checked]:bg-sky-600 data-[state=checked]:!border-sky-600"
    >
      <Switch.Thumb className="block h-[22px] w-[22px] bg-white dark:bg-zinc-900 rounded-full border border-zinc-100 dark:border-zinc-500 transition data-[state=checked]:!border-transparent shadow data-[state=checked]:translate-x-4" />
    </Switch.Root>
  );
};
