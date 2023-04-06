import { styled } from '@commonalityco/ui-theme';

export const StyledHeading = styled('h2', {
  fontWeight: '$semibold',
  textDecoration: 'none',
  color: '$foreground',
  variants: {
    size: {
      '4xl': {
        fontSize: '$9',
      },

      '3xl': {
        fontSize: '$8',
      },
      '2xl': {
        fontSize: '$7',
      },
      xl: {
        fontSize: '$6',
        marginBottom: '$4',
      },
      lg: {
        fontSize: '$5',
      },
      md: {
        fontSize: '$4',
        marginBottom: '$3',
      },
      sm: {
        fontSize: '$3',
        marginBottom: '$3',
      },
      xs: {
        fontSize: '$2',
      },
      '2xs': {
        fontSize: '$1',
      },
    },
  },
});
