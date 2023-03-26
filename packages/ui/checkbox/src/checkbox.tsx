import { ComponentProps } from 'react';
import { Icon } from '@commonalityco/ui-icon';
import { faCheck, faMinus } from '@fortawesome/free-solid-svg-icons';
import * as RadixCheckbox from '@radix-ui/react-checkbox';

export interface CheckboxProps
  extends ComponentProps<typeof RadixCheckbox.Root> {}

export function Checkbox({ checked = false, ...restProps }: CheckboxProps) {
  return (
    <RadixCheckbox.Root
      checked={checked}
      {...restProps}
      className="shrink-0 grow-0 h-4 w-4 rounded border data-[state=unchecked]:border-zinc-100 dark:data-[state=unchecked]:border-zinc-500  cursor-pointer flex items-center justify-center hover:data-[state=unchecked]:border-zinc-400 hover:dark:data-[state=unchecked]:border-zinc-400 data-[state=indeterminate]:bg-white dark:data-[state=indeterminate]:bg-zinc-900 data-[state=indeterminate]:border-sky-600 data-[state=checked]:bg-sky-600 data-[state=checked]:border-sky-600 hover:data-[state=unchecked]:border-zinc-400 dark:hover:data-[state=unchecked]:border-zinc-500 data-[state=unchecked]:bg-white dark:data-[state=unchecked]:bg-zinc-900"
    >
      <RadixCheckbox.Indicator className="data[state=indeterminate]:text-sky-600">
        {checked === 'indeterminate' && (
          <Icon
            icon={faMinus}
            transform={{ size: 12, y: 0 }}
            className="text-sky-600"
          />
        )}
        {checked === true && (
          <Icon
            icon={faCheck}
            transform={{ size: 12, y: 0 }}
            className="!text-white"
          />
        )}
      </RadixCheckbox.Indicator>
    </RadixCheckbox.Root>
  );
}
