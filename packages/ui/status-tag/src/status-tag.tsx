import React from 'react';
import {
  Text,
  StatusContent,
  DefaultStatusTag,
  InfoStatusTag,
  ErrorStatusTag,
  WarningStatusTag,
  SuccessStatusTag,
} from './status-tag.styles';
import { StatusDot } from '@commonalityco/ui-status-dot';

export type StatusTagProps = {
  use?: 'success' | 'warning' | 'error' | 'info' | 'default';
  text?: React.ReactNode;
  className?: string;
};

const CONTAINER_BY_USE = {
  default: DefaultStatusTag,
  info: InfoStatusTag,
  success: SuccessStatusTag,
  error: ErrorStatusTag,
  warning: WarningStatusTag,
};

export function StatusTag({
  text,
  use = 'default',
  className,
}: StatusTagProps) {
  const ContainerEl = CONTAINER_BY_USE[use];

  return (
    <ContainerEl className={className}>
      <StatusContent>
        <StatusDot use={use} />
        <Text>{text}</Text>
      </StatusContent>
    </ContainerEl>
  );
}
