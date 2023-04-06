import { styled } from '@commonalityco/ui-theme';
import type {} from '@stitches/react';
import * as Checkbox from '@radix-ui/react-checkbox';

export const StyledCheckbox = styled(Checkbox.Root, {
  boxSizing: 'border-box',
  height: '$space$4',
  width: '$space$4',
  borderRadius: '$2',
  border: 'solid 1px $accent4',
  backgroundColor: '$background',
  cursor: 'pointer',
  transition: 'all $1 ease-out',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

  '&:hover': {
    borderColor: '$accent5',
  },

  '&[data-state="indeterminate"]': {
    backgroundColor: '$background',
    borderColor: '$action2',

    '&:hover': {
      backgroundColor: '$action1',
    },

    '&:active': {
      backgroundColor: '$action3',
    },
  },

  '&[data-state="checked"]': {
    backgroundColor: '$action2',
    borderColor: '$action2',

    '&:hover': {
      backgroundColor: '$action1',
    },

    '&:active': {
      backgroundColor: '$action3',
    },
  },

  '&[data-state="unchecked"]:hover': {
    borderColor: '$accent5',
  },
});

export const StyledIndicator = styled(Checkbox.Indicator, {
  color: '$white',

  '&[data-state="indeterminate"]': {
    color: '$action2',
  },
});

export const Content = styled('span', {
  marginLeft: '$3',
  fontSize: '$5',
  color: '$accent7',
  userSelect: 'none',
  cursor: 'pointer',
});

export const StyledIcon = styled('span', {
  opacity: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
  transition: 'all $1 ease-out',

  variants: {
    checked: {
      true: {
        opacity: 1,
      },
    },
  },
});
