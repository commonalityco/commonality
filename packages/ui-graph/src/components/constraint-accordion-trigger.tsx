import React from 'react';
import { Constraint } from '@commonalityco/types';
import { AccordionTrigger, Badge } from '@commonalityco/ui-design-system';

export function ConstraintAccordionTrigger({
  constraint,
  variant,
  children,
}: {
  constraint: Constraint;
  variant: 'pass' | 'error';
  children?: React.ReactNode;
}) {
  return (
    <AccordionTrigger className="text-left">
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
