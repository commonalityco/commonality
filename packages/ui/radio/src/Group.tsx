import { Root } from '@radix-ui/react-radio-group';
import { ComponentProps } from 'react';

interface RadioGroupProps extends ComponentProps<typeof Root> {}

export function Group({ children, ...restProps }: RadioGroupProps) {
  return <Root {...restProps}>{children}</Root>;
}
