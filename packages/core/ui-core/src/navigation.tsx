import { cn } from '@commonalityco/ui-design-system';
import React from 'react';
import { Logo } from './logo';

interface NavigationProperties {
  children?: React.ReactNode;
  className?: string;
}

export function Divider({ className }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M16 1L8 23" className="stroke-border" stroke-linecap="round" />
    </svg>
  );
}

export function NavigationLogo() {
  return <Logo width={24} height={24} className="text-foreground" />;
}

export function Navigation({ children, className }: NavigationProperties) {
  return (
    <div
      className={cn(
        'relative flex h-14 w-full shrink-0 items-center justify-between px-6',
        className
      )}
    >
      {children}
    </div>
  );
}
