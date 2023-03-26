import {
  zinc_50,
  zinc_400,
  WHITE,
  zinc_300,
  BLUE_600,
  zinc_500,
  RED_600,
} from '@commonality/colors';
import {
  BOX_SHADOW_BASE,
  BOX_SHADOW_DEFAULT_FOCUS,
  BOX_SHADOW_ERROR_FOCUS,
  FONT_FAMILY_PRIMARY,
} from '@commonalityco/ui-theme';
import styled from 'styled-components';

export const HelpText = styled.p`
  color: ${zinc_500};
`;

export const Wrapper = styled.div<{
  use: 'primary' | 'secondary' | 'transparent';
}>`
  position: relative;

  ${(props) =>
    props.use === 'transparent'
      ? `&:before {
      border-radius: 4px;
      content: '';
      position: absolute;
      top: -8px;
      bottom: -8px;
      left: -8px;
      right: -8px;
      opacity: 0;
      z-index: -1;
      transition: 125ms opacity ease-out;
    }

    &:hover&:before {
      opacity: 1;
    }`
      : ''}
`;

export const TextArea = styled.textarea`
  display: block;
  border-radius: 5px;
  font-family: ${FONT_FAMILY_PRIMARY};
  font-size: 14px;
  letter-spacing: -0.006em;
  line-height: 20px;
  outline: none;
  border: none;
  cursor: text;
  transition: all ease-in-out 100ms;
  min-width: 300px;
  min-height: 100px;
  width: 100%;
  box-sizing: border-box;
  height: ${(props) => props.height || 'auto'};
  resize: vertical;

  &::placeholder {
    color: ${zinc_400};
  }
`;

export const PrimaryTextArea = styled(TextArea)<{ ['aria-invalid']?: boolean }>`
  background-color: ${zinc_50};
  color: var(--color-secondary);
  border: solid 1px ${zinc_300};
  box-shadow: ${BOX_SHADOW_BASE};
  padding: 12px 16px;

  &:focus,
  &:focus-within,
  &:active {
    border: solid 1px ${BLUE_600};
    box-shadow: ${BOX_SHADOW_DEFAULT_FOCUS};
  }

  &[aria-invalid='true'] {
    border-color: ${RED_600};

    &:focus,
    &:focus-within,
    &:active {
      box-shadow: ${BOX_SHADOW_ERROR_FOCUS};
    }
  }
`;

export const SecondaryTextArea = styled(TextArea)`
  background-color: ${WHITE};
  color: var(--color-secondary);
  border: solid 1px ${(props) => (props.hasError ? RED_600 : zinc_300)};
  box-shadow: ${BOX_SHADOW_BASE};
  padding: 12px 16px;

  &:focus,
  &:focus-within,
  &:active {
    border: solid 1px ${(props) => (props.hasError ? RED_600 : BLUE_600)};
    box-shadow: ${(props) => {
      return props.hasError ? BOX_SHADOW_ERROR_FOCUS : BOX_SHADOW_DEFAULT_FOCUS;
    }};
  }
`;

export const TransparentTextArea = styled(TextArea)`
  border: none;
  background-color: transparent;
  color: var(--color-secondary);
  resize: none;
  position: relative;
`;

export const Counter = styled.p`
  position: absolute;
  text-align: right;
  display: inline-block;
  width: 100%;
  line-height: 1;
  margin-bottom: 0;
  margin-top: 12px;
  font-size: 0.875rem;
  font-family: ${({ theme }) => theme.fontFamily.primary};
`;
