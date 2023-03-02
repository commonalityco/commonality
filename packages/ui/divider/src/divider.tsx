import clsx from 'clsx';

export interface DividerProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  direction?: 'horizontal' | 'vertical';
}

export function Divider({
  className,
  direction = 'horizontal',
  ...props
}: DividerProps) {
  return (
    <div
      {...props}
      className={clsx(
        'bg-zinc-300 dark:bg-zinc-700',
        {
          'w-full h-px': direction === 'horizontal',
          'w-px h-[1.5em]': direction === 'vertical',
        },
        className
      )}
      role="separator"
    />
  );
}
