import { WordLogo, Logo } from '@commonalityco/ui-core';
import { Badge } from '@commonalityco/ui-design-system';
import React from 'react';

export function NavigationLogo({ version }: { version: string }) {
  return (
    <span className="flex gap-3 items-center">
      <Logo />
      <WordLogo />
      <span className="text-xs font-mono font-medium hidden md:block">
        {version}
      </span>
      <Badge className="border-blue-700  bg-blue-700/10 text-blue-700 dark:border-blue-400 dark:bg-blue-400/20 dark:text-blue-400 rounded-full shadow-none hover:bg-inherit">
        BETA
      </Badge>
    </span>
  );
}
