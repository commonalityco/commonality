import { cn } from '@commonalityco/ui-design-system/cn';
import { Slot } from '@radix-ui/react-slot';
import React from 'react';

interface NavigationButtonProperties
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  asChild?: boolean;
  active?: boolean;
}

export const NavigationButton = React.forwardRef<
  HTMLAnchorElement,
  NavigationButtonProperties
>(({ asChild, active, className, children, ...properties }, reference) => {
  const Comp = asChild ? Slot : 'a';

  return (
    <Comp
      className={cn(
        'relative inline-block cursor-pointer pb-2',
        {
          'before:border-foreground text-foreground before:absolute before:-bottom-px before:left-0 before:right-0 before:border-b-2 before:content-[""] before:rounded-full font-semibold':
            active,
        },
        className,
      )}
      ref={reference}
      {...properties}
    >
      <div
        className={cn(
          'text-muted-foreground hover:text-foreground transition-colors px-4 py-2 hover:bg-secondary rounded-md flex gap-2 items-center',
          {
            'text-foreground': active,
          },
        )}
      >
        {children}
      </div>
    </Comp>
  );
});
