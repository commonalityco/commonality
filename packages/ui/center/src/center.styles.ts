import { styled } from '@commonalityco/ui-theme';
import type {} from '@stitches/react';

export const StyledCenter = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
});

export const StyledAbsoluteCenter = styled('div', {
  position: 'absolute',
  variants: {
    axis: {
      horizontal: {
        insetStart: '50%',
        transform: 'translateX(-50%)',
      },
      vertical: {
        top: '50%',
        transform: 'translateY(-50%)',
      },
      both: {
        insetStart: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
      },
    },
  },
});
