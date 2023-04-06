import { styled } from '@commonalityco/ui-theme';
import type {} from '@stitches/react';

export const StyledContainer = styled('div', {
  margin: '0 auto',
  position: 'relative',
  width: '100%',
  variants: {
    maxWidth: {
      xs: {
        maxWidth: '420px',
      },
      sm: {
        maxWidth: '640px',
      },
      md: {
        maxWidth: '$sizes$4xl',
      },
      lg: {
        maxWidth: '$sizes$7xl',
      },
      xl: {
        maxWidth: '$sizes8xl',
      },
    },
  },
});
