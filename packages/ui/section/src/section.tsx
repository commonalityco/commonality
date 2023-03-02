import { cva, type VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

const sectionVariants = cva('my-0 relative p-6', {
  variants: {
    use: {
      primary: 'bg-transparent',
      secondary: 'bg-zinc-50',
    },
  },
});

export interface SectionProps
  extends React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLDivElement>,
      HTMLDivElement
    >,
    VariantProps<typeof sectionVariants> {}

export function Section({
  children,
  className,
  use,
  ...restProps
}: SectionProps) {
  return (
    <div
      {...restProps}
      className={twMerge(sectionVariants({ use, className }))}
    >
      {children}
    </div>
  );
}
