import clsx from 'clsx';
import React from 'react';

export interface RootProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  use: 'primary' | 'secondary' | 'tertiary';
}

export function Root({ children, use, className, ...restProps }: RootProps) {
  return (
    <div
      {...restProps}
      className={clsx(
        'relative rounded w-full',
        {
          'border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900':
            use === 'primary',
          'shadow-md': use === 'secondary',
          'bg-zinc-50 border border-zinc-100': use === 'tertiary',
        },
        className
      )}
    >
      {children}
    </div>
  );
}

Root.defaultProps = {
  use: 'primary',
};
