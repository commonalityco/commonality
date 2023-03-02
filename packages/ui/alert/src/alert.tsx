import React from 'react';
import {
  StyledAlert,
  StyledTitle,
  StyledCloseButton,
  StyledText,
  StyledTextContainer,
} from './alert.styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { theme } from '@commonalityco/ui-theme';
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
  status = 'info',
  closeable = false,
  onClose = () => {},
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
