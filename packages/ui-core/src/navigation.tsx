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
>(({ asChild, active, className, ...properties }, reference) => {
  const Comp = asChild ? Slot : 'a';

  return (
    <Comp
      className={cn(
        'text-muted-foreground hover:text-foreground relative inline-block cursor-pointer px-4 pb-4 pt-2 transition-colors',
        {
          'before:border-foreground text-foreground before:absolute before:bottom-0 before:left-0 before:right-0 before:border-b-2 before:content-[""]':
            active,
        },
        className,
      )}
      ref={reference}
      {...properties}
    />
  );
});

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
