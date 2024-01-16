import { WordLogo, Logo } from '@commonalityco/ui-core';
import { Badge } from '@commonalityco/ui-design-system';
import React from 'react';

export function NavigationLogo({ version }: { version: string }) {
  return (
    <span className="flex gap-3 items-center">
      <Logo />
      <span className="text-xl font-bold tracking-wide">commonality</span>
      <span className="text-xs font-mono font-medium hidden md:block">
        {version}
      </span>
      <Badge className="border-blue-600  bg-blue-600/10 text-blue-600 dark:border-blue-500 dark:bg-blue-500/20 dark:text-blue-500 rounded-full shadow-none hover:bg-inherit">
        BETA
      </Badge>
    </span>
  );
}
