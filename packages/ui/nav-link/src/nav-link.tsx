import { ComponentProps, forwardRef } from 'react';
import Link from 'next/link';
import clsx from 'clsx';

export interface NavLinkProps extends ComponentProps<typeof Link> {
  active?: boolean;
}

export const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ children, active, className, ...props }: NavLinkProps, ref) => {
    return (
      <Link
        {...props}
        ref={ref}
        data-state={active && 'active'}
        className={clsx(
          className,
          'transition antialiased rounded block p-3 h-9 leading-none border-none cursor-pointer no-underline text-zinc-500 dark:text-600 outline-none text-sm break-keep truncate w-full data-[state=active]:text-zinc-800 dark:data-[state=active]:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-800 dark:hover:text-white active:bg-zinc-200 dark:active:bg-zinc-700 disabled:cursor-not-allowed mt-2 first:mt-0',
          { 'font-semibold': active, 'font-regular': !active }
        )}
      >
        {children}
      </Link>
    );
  }
);
