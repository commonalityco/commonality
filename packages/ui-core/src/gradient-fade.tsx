import React, { HTMLAttributes } from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

const gradientFadeStyles = cva(
  'pointer-events-none sticky z-10 from-background',
  {
    variants: {
      placement: {
        top: 'h-6 top-0 bg-gradient-to-b',
        bottom: 'h-6 bottom-0 bg-gradient-to-t',
        left: 'w-6 left-0 bg-gradient-to-r',
        right: 'w-6 right-0 bg-gradient-to-l',
      },
    },
  }
);

interface GradientFadeProperties
  extends VariantProps<typeof gradientFadeStyles>,
    HTMLAttributes<'div'> {}

export function GradientFade({ placement, className }: GradientFadeProperties) {
  return (
    <div className={twMerge(gradientFadeStyles({ placement }), className)} />
  );
}
