'use client';
import Link from 'next/link';
import { ComponentProps } from 'react';
import { cva } from 'class-variance-authority';
import { usePathname } from 'next/navigation';

const navigationButtonStyles = cva(
  'cursor-pointer rounded-full py-2 px-4 group transition-all flex flex-nowrap gap-2 items-center text-sm font-medium dark:active:bg-zinc-700',
  {
    variants: {
      active: {
        true: 'dark:text-white text-zinc-800 bg-zinc-100 dark:bg-zinc-800',
        false:
          'dark:text-zinc-300 text-zinc-400 hover:text-zinc-800 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800',
      },
    },
  }
);

const iconStyle = cva('transition-all', {
  variants: {
    active: {
      true: 'text-zinc-600 dark:text-zinc-200',
      false: 'text-zinc-400 dark:text-zinc-600',
    },
  },
});

interface NavigationButtonProps extends ComponentProps<typeof Link> {
  icon?: React.ReactNode;
}

export function NavigationButton({
  children,
  className,
  href,
  icon,
  ...props
}: NavigationButtonProps) {
  const pathname = usePathname() ?? '/';
  const active = pathname.includes(href.toString());

  return (
    <Link
      {...props}
      href={href}
      className={navigationButtonStyles({
        className,
        active,
      })}
    >
      {icon && <div className={iconStyle({ className, active })}>{icon}</div>}
      {children}
    </Link>
  );
}
