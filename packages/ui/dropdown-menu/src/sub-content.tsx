import {
  SubContent as RadixSubContent,
  Portal,
} from '@radix-ui/react-dropdown-menu';
import { ComponentProps } from 'react';
import clsx from 'clsx';
import { contentClassname } from './contentClassname';

export function SubContent({
  className,
  ...restProps
}: ComponentProps<typeof RadixSubContent>) {
  return (
    <Portal>
      <RadixSubContent
        {...restProps}
        className={clsx(contentClassname, className)}
      />
    </Portal>
  );
}
