import { styled } from '@commonalityco/ui-theme';
import type {} from '@stitches/react';

export const StyledDescriptionList = styled('dl', {
  margin: '$0',

  '& dt': {
    margin: '$0',
    fontFamily: '$inter',
    color: '$accent7',
    fontSize: '$4',
    marginBottom: '$1',
  },

  '& dd': {
    margin: '$0',
    fontFamily: '$inter',
    color: '$foreground',
    fontSize: '$5',
  },

  '& dd + dt': {
    marginTop: '$4',
  },
});
