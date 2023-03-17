import { theme } from '@commonalityco/ui-theme';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import {
  StyledAlert, StyledCloseButton,
  StyledText,
  StyledTextContainer, StyledTitle
} from './alert.styles';
export interface AlertProps {
  children?: React.ReactNode;
  status?: 'info' | 'success' | 'warning' | 'error';
  className?: string;
  title?: React.ReactNode;
  closeable?: boolean;
  onClose?: () => any;
}

export function Alert({
  className,
  children,
  closeable = false,
  onClose = () => { },
  title,
}: AlertProps) {
  return (
    <StyledAlert className={className}>
      <StyledTextContainer>
        {title && <StyledTitle>{title}</StyledTitle>}
        <StyledText>{children}</StyledText>
      </StyledTextContainer>
      {closeable && (
        <StyledCloseButton onClick={onClose}>
          <FontAwesomeIcon
            icon={faTimes}
            transform={{ y: 1 }}
            size="lg"
            color={theme.colors.accent8 as any}
          />
        </StyledCloseButton>
      )}
    </StyledAlert>
  );
}
