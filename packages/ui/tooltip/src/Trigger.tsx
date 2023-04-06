import { Trigger as RadixTrigger } from '@radix-ui/react-tooltip';
import { ComponentProps } from 'react';

export function Trigger(props: ComponentProps<typeof RadixTrigger>) {
  return <RadixTrigger {...props} type="button" />;
}
