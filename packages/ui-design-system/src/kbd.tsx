import * as React from 'react';

import { cn } from './cn.js';

const Kbd = ({
  children,
  className,
  ...properties
}: React.ComponentPropsWithoutRef<'kbd'>) => {
  return (
    <kbd
      {...properties}
      className={cn(
        'bg-accent text-accent-foreground min-w-5 inline-flex h-5 w-fit items-center justify-center rounded-md border px-1 font-sans text-xs font-semibold antialiased',
        className,
      )}
    >
      {children}
    </kbd>
  );
};

export { Kbd };
