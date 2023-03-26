import clsx from 'clsx';

interface TagProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLSpanElement>,
    HTMLSpanElement
  > {
  use?: 'primary' | 'secondary';
}

export function Tag({
  children,
  use = 'primary',
  className,
  ...restProps
}: TagProps) {
  return (
    <span
      {...restProps}
      className={clsx(
        'inline-block rounded-full py-0 px-2 leading-normal font-regular text-xs bg-zinc-100 border border-zinc-100 dark:border-zinc-800 dark:bg-zinc-800 h-5',
        {
          'text-zinc-800 dark:text-white': use === 'primary',
          'text-zinc-500 dark:text-zinc-400': use === 'secondary',
        },
        className
      )}
    >
      {children}
    </span>
  );
}
