import React from 'react';
import { StyledDescriptionList } from './description-list.styles';

export interface DescriptionListProps {
  children?: React.ReactNode;
  className?: string;
}

export function DescriptionList({ children, className }: DescriptionListProps) {
  return (
    <div data-theme="light">
      <StyledDescriptionList className={className}>
        {children}
      </StyledDescriptionList>
    </div>
  );
}
