import { HTMLAttributes } from 'react';
import {
  SuccessStatusDot,
  WarningStatusDot,
  ErrorStatusDot,
  InfoStatusDot,
  PendingStatusDot,
} from './status-dot.styles';

export interface StatusDotProps extends HTMLAttributes<HTMLSpanElement> {
  use?: 'success' | 'warning' | 'error' | 'info' | 'default';
}

const COMPONENT_BY_USE = {
  success: SuccessStatusDot,
  warning: WarningStatusDot,
  error: ErrorStatusDot,
  info: InfoStatusDot,
  default: PendingStatusDot,
};

export function StatusDot({ use = 'info', ...restProps }: StatusDotProps) {
  const Component = COMPONENT_BY_USE[use];

  return <Component {...restProps} />;
}
