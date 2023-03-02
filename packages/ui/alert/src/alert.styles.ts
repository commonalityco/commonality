import { styled } from '@commonalityco/ui-theme';
import type {} from '@stitches/react';

export const StyledTextContainer = styled('div', {
  display: 'flex',
  alignItems: 'baseline',
});
export const StyledCloseButton = styled('button', {
  cursor: 'pointer',
  appearance: 'none',
  outline: 'none',
  width: '$5',
  marginLeft: '$3',
  background: 'transparent',
  border: 'none',
  padding: '0',
});

export const StyledTitle = styled('p', {
  fontWeight: '$bold',
  display: 'inline-block',
  margin: '0',
  marginRight: '$4',
  marginLeft: '$3',
  fontSize: '$5',
  color: '$accent7',
  fontFamily: '$inter',
});

export const StyledText = styled('p', {
  color: '$accent7',
  margin: 0,
  marginLeft: '$3',
  fontSize: '$5',
  flexShrink: '2',
  fontFamily: '$inter',

  '& *': {
    fontSize: '$5',
    fontFamily: '$inter',
  },
});

export const StyledAlert = styled('div', {
  padding: '$3 $5',
  borderRadius: '$2',
  borderTopLeftRadius: '$1',
  borderBottomLeftRadius: '$1',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: '$accent1',
  fontFamily: '$inter',
  boxShadow: '$md',
  position: 'relative',
  borderTop: '1px solid $accent4',
  borderRight: '1px solid $accent4',
  borderBottom: '1px solid $accent4',

  '&:before': {
    position: 'absolute',
    left: '0',
    top: '-1px',
    bottom: '-1px',
    content: "''",
    width: '$1',
    borderRadius: '$2',
  },

  variants: {
    status: {
      info: {
        backgroundColor: '$blue500',
      },
      success: {
        backgroundColor: '$green500',
      },
      warning: {
        backgroundColor: '$yellow500',
      },
      error: {
        backgroundColor: '$error500',
      },
    },
  },
});
