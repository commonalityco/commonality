import { cn } from '@commonalityco/ui-design-system/cn';
import React from 'react';

interface NavigationProperties {
  children?: React.ReactNode;
  className?: string;
}

export function Navigation({ children, className }: NavigationProperties) {
  return (
    <div
      className={cn(
        'relative flex h-14 w-full shrink-0 items-center justify-between px-6',
        className,
      )}
    >
      {children}
    </div>
  );
}

export default Navigation;
