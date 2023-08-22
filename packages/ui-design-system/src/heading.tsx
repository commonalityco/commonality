import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './cn.js';

type HeaderProperties = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLHeadingElement>,
  HTMLHeadingElement
>;

type ParagraphProperties = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLParagraphElement>,
  HTMLParagraphElement
>;

const headingVariants = cva('font-semibold text-foreground antialiased', {
  variants: {
    size: {
      xs: 'text-xs',
      sm: 'text-sm',
      md: 'text-base mb-1',
      lg: 'text-lg mb-1',
      xl: 'text-xl mb-1',
      '2xl': 'text-2xl',
      '3xl': 'text-3xl',
      '4xl': 'text-4xl mb-2',
    },
  },
});

export interface HeadingProperties
  extends HeaderProperties,
    VariantProps<typeof headingVariants> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p';
}

const elementComponentsBySize = {
  h1: (properties: HeaderProperties) => <h1 {...properties} />,
  h2: (properties: HeaderProperties) => <h2 {...properties} />,
  h3: (properties: HeaderProperties) => <h3 {...properties} />,
  h4: (properties: HeaderProperties) => <h4 {...properties} />,
  h5: (properties: HeaderProperties) => <h5 {...properties} />,
  h6: (properties: HeaderProperties) => <h6 {...properties} />,
  p: (properties: ParagraphProperties) => <p {...properties} />,
};

export function Heading({
  children,
  as = 'h2',
  size = '4xl',
  className,
  ...restProperties
}: HeadingProperties) {
  const Component = elementComponentsBySize[as];

  return (
    <Component
      {...restProperties}
      className={cn(headingVariants({ size, className }))}
    >
      {children}
    </Component>
  );
}
