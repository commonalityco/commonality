import { cva, VariantProps } from 'class-variance-authority';
import { cn } from './cn.js';

export interface SnippetProperties
  extends React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLDivElement>,
      HTMLDivElement
    >,
    VariantProps<typeof snippetStyles> {}

const snippetStyles = cva(
  'font-medium text-zinc-800 dark:text-white items-center rounded inline-block bg-zinc-100 dark:bg-zinc-800 leading-none font-mono',
  {
    variants: {
      size: {
        sm: 'px-2 py-1 text-xs',
        md: 'px-3 py-2 text-sm',
        lg: 'px-4 py-3 text-sm',
      },
    },
  },
);

export function Snippet({
  children,
  className,
  size = 'sm',
  ...restProperties
}: SnippetProperties) {
  return (
    <span
      {...restProperties}
      className={cn(snippetStyles({ size }), className)}
    >
      {children}
    </span>
  );
}
