import { cn } from '@commonalityco/ui-design-system';
import { Slot } from '@radix-ui/react-slot';
import React from 'react';
import { Logo } from './logo';

interface NavigationButtonProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  asChild?: boolean;
  active?: boolean;
}

export const NavigationButton = React.forwardRef<
  HTMLAnchorElement,
  NavigationButtonProps
>(({ asChild, active, className, ...props }, ref) => {
  const Comp = asChild ? Slot : 'a';

  return (
    <Comp
      className={cn(
        'text-muted-foreground hover:text-foreground relative inline-block cursor-pointer px-4 pb-4 pt-2 transition-colors',
        {
          'before:border-foreground text-foreground before:absolute before:bottom-0 before:left-0 before:right-0 before:border-b-2 before:content-[""]':
            active,
        },
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

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
      <path d="M16 1L8 23" className="stroke-border" strokeLinecap="round" />
    </svg>
  );
}

export function NavigationLogo() {
  return <Logo width={24} height={24} className="text-foreground" />;
}

interface NavigationProperties {
  children?: React.ReactNode;
  className?: string;
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
