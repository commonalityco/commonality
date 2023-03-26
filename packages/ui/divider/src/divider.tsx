import { cva, VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

export interface DividerProps
  extends React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLDivElement>,
      HTMLDivElement
    >,
    VariantProps<typeof dividerStyles> {}

const dividerStyles = cva('bg-zinc-200 dark:bg-zinc-800', {
  variants: {
    direction: {
      horizontal: 'w-full h-px',
      vertical: 'w-px h-[1.5em]',
    },
  },
});

export function Divider({
  className,
  direction = 'horizontal',
  ...props
}: DividerProps) {
  return (
    <div
      {...props}
      className={twMerge(dividerStyles({ className, direction }))}
      role="separator"
    />
  );
}
