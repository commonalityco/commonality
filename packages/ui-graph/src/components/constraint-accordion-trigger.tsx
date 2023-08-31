import React from 'react';
import { Constraint } from '@commonalityco/types';
import { AccordionTrigger } from '@commonalityco/ui-design-system/accordion';
import { Badge } from '@commonalityco/ui-design-system/badge';
import { cn } from '@commonalityco/ui-design-system';

export function ConstraintAccordionTrigger({
  constraint,
  variant,
  children,
  className,
}: {
  constraint: Constraint;
  variant: 'pass' | 'error';
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <AccordionTrigger className={cn('text-left', className)}>
      <div>
        <Badge
          className="grid grid-cols-[auto_1fr] gap-1"
          variant={variant === 'pass' ? 'success' : 'destructive'}
        >
          {constraint.applyTo === '*' ? (
            'All packages'
          ) : (
            <span className="truncate">{`#${constraint.applyTo}`}</span>
          )}
        </Badge>
        {children}
      </div>
    </AccordionTrigger>
  );
}
