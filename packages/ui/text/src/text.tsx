import { cva, VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

interface TextProps
  extends React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLParagraphElement>,
      HTMLParagraphElement
    >,
    VariantProps<typeof textStyles> {
  use?: 'help' | 'error' | 'code';
}

const textStyles = cva(
  'text-sm text-zinc-600 no-underline antialiased dark:text-zinc-200',
  {
    variants: {
      use: {
        help: 'font-regular text-zinc-400 dark:text-zinc-500',
        error: 'text-red-600',
        code: 'inline-block font-mono font-medium',
      },
    },
  }
);

export const Text = ({ children, use, className, ...restProps }: TextProps) => {
  return (
    <p {...restProps} className={twMerge(textStyles({ use, className }))}>
      {children}
    </p>
  );
};
