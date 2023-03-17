'use client';

import { Section } from '@commonalityco/ui-section';
import { Logo } from 'images/logo';
import { getProject } from 'data/project';
import { Heading } from '@commonalityco/ui-heading';
import Link from 'next/link';
import { ComponentProps } from 'react';
import { cva } from 'class-variance-authority';
import { usePathname, useSelectedLayoutSegment } from 'next/navigation';

const navigationButtonStyles = cva(
  'dark:text-white rounded-full py-1 px-3 dark:hover:bg-zinc-800 transition',
  {
    variants: {
      active: {
        true: 'bg-zinc-800 text-white',
      },
    },
  }
);

export function NavigationButton({
  children,
  className,
  href,
  ...props
}: ComponentProps<typeof Link>) {
  const pathname = usePathname() ?? '/';

  return (
    <Link
      {...props}
      href={href}
      className={navigationButtonStyles({
        className,
        active: pathname === href,
      })}
    >
      {children}
    </Link>
  );
}

export function NavigationButtons({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-nowrap items-center gap-2">{children}</div>;
}
