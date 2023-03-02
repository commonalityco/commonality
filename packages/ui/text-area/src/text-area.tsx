import React, { useState } from 'react';
import {
  PrimaryTextArea,
  SecondaryTextArea,
  TransparentTextArea,
  Counter,
  HelpText,
  Wrapper,
} from './text-area.styles';

export interface TextAreaProps
  extends React.InputHTMLAttributes<HTMLTextAreaElement> {
  use?: 'primary' | 'secondary' | 'transparent';
  hasCounter?: boolean;
  height?: string;
  hasError?: boolean;
}

const COMPONENT_BY_USE = {
  primary: PrimaryTextArea,
  secondary: SecondaryTextArea,
  transparent: TransparentTextArea,
};

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      className,
      use = 'primary',
      placeholder,
      autoComplete,
      hasCounter = false,
      height,
      hasError,
      ...restProps
    }: TextAreaProps,
    ref
  ) => {
    const [characterCount, setCharacterCount] = useState(0);
    const Component = COMPONENT_BY_USE[use];

    return (
      <Wrapper className={className} use={use}>
        <Component use={use} aria-invalid={hasError} {...restProps} ref={ref} />
        {hasCounter && (
          <Counter>
            <HelpText>{characterCount} characters</HelpText>
          </Counter>
        )}
      </Wrapper>
    );
  }
);
