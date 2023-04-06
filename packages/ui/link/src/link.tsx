import React, { ComponentProps } from 'react';
import NextLink from 'next/link';
import clsx from 'clsx';

export interface LinkProps extends ComponentProps<typeof NextLink> {}

export const Link = React.forwardRef(
  ({ children, className, ...restProps }: LinkProps, ref) => {
    return (
      <NextLink
        {...restProps}
        ref={ref as any}
        className={clsx(
          'bg-transparent border-none font-sans p-0 font-medium text-sm text-zinc-800 dark:text-white cursor-pointer inline-block no-underline align-baseline color-zinc-800 hover:underline',
          className
        )}
      >
        {children}
      </NextLink>
    );
  }
);

Link.defaultProps = {
  href: '',
};
