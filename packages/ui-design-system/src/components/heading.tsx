import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils/cn';

type HeaderProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLHeadingElement>,
  HTMLHeadingElement
>;

type ParagraphProps = React.DetailedHTMLProps<
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

export interface HeadingProps
  extends HeaderProps,
    VariantProps<typeof headingVariants> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p';
}

const elementComponentsBySize = {
  h1: (props: HeaderProps) => <h1 {...props} />,
  h2: (props: HeaderProps) => <h2 {...props} />,
  h3: (props: HeaderProps) => <h3 {...props} />,
  h4: (props: HeaderProps) => <h4 {...props} />,
  h5: (props: HeaderProps) => <h5 {...props} />,
  h6: (props: HeaderProps) => <h6 {...props} />,
  p: (props: ParagraphProps) => <p {...props} />,
};

export function Heading({
  children,
  as = 'h2',
  size = '4xl',
  className,
  ...restProps
}: HeadingProps) {
  const Component = elementComponentsBySize[as];

  return (
    <Component
      {...restProps}
      className={cn(headingVariants({ size, className }))}
    >
      {children}
    </Component>
  );
}
