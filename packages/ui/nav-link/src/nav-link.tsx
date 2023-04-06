import { ComponentProps, forwardRef } from 'react';
import Link from 'next/link';
import { buttonStyles } from '@commonalityco/ui-button';
import { VariantProps, cx, cva } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

const navLinkStyles = cva('', {
  variants: {
    active: {
      true: 'bg-zinc-100 dark:bg-zinc-800',
    },
  },
});

export interface NavLinkProps
  extends ComponentProps<typeof Link>,
    VariantProps<typeof buttonStyles> {
  active?: boolean;
}

export const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  (
    {
      children,
      active,
      className,
      use = 'primary',
      size = 'md',
      ...props
    }: NavLinkProps,
    ref
  ) => {
    return (
      <Link
        {...props}
        ref={ref}
        data-state={active && 'active'}
        className={twMerge(
          buttonStyles({ use, size }),
          navLinkStyles({ active }),
          className
        )}
      >
        {children}
      </Link>
    );
  }
);
