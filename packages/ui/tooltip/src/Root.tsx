import { Root as RadixRoot, Provider } from '@radix-ui/react-tooltip';
import { ComponentProps } from 'react';

export function Root(props: ComponentProps<typeof RadixRoot>) {
  return (
    <Provider delayDuration={400}>
      <RadixRoot {...props} />
    </Provider>
  );
}
