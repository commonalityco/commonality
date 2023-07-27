import React from 'react';
import { Logo } from './logo';

interface NavigationProperties {
  children?: React.ReactNode;
  title?: React.ReactNode;
}

export function Navigation({ children, title }: NavigationProperties) {
  return (
    <div className="relative flex h-14 w-full shrink-0 items-center justify-between border-b px-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-nowrap items-center justify-center gap-4">
          <Logo width={24} height={24} className="text-foreground" />
          {title}
        </div>
      </div>

      <div className="flex flex-nowrap items-center gap-4">{children}</div>
    </div>
  );
}
