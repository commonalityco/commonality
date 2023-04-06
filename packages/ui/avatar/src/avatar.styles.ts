import { styled } from '@commonalityco/ui-theme';
import * as AvatarPrimitive from '@radix-ui/react-avatar';

export const StyledAvatar = styled(AvatarPrimitive.Root, {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  verticalAlign: 'middle',
  overflow: 'hidden',
  userSelect: 'none',
  width: '$space$8',
  height: '$space$8',
  borderRadius: '100%',
  backgroundColor: '$accent4',
  variants: {
    size: {
      sm: {
        width: '$space$5',
        height: '$space$5',
      },
      md: {
        width: '$space$8',
        height: '$space$8',
      },
    },
  },
});

export const StyledImage = styled(AvatarPrimitive.Image, {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  borderRadius: 'inherit',
});

export const StyledFallback = styled(AvatarPrimitive.Fallback, {
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '$foreground',
  color: '$accent4',
  fontSize: '$1',
  fontWeight: '$semibold',
});
