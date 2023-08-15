import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '../utils/cn';

interface TextProperties
  extends React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLParagraphElement>,
      HTMLParagraphElement
    >,
    VariantProps<typeof textStyles> {
  use?: 'help' | 'error' | 'code' | 'default';
}

const textStyles = cva('text-sm no-underline antialiased font-regular', {
  variants: {
    use: {
      default: 'text-muted-foreground',
      help: 'text-muted-foreground',
      error: 'text-destructive',
      code: 'font-mono',
    },
  },
});

export const Text = ({
  children,
  use = 'default',
  className,
  ...restProperties
}: TextProperties) => {
  return (
    <p {...restProperties} className={cn(textStyles({ use }), className)}>
      {children}
    </p>
  );
};
