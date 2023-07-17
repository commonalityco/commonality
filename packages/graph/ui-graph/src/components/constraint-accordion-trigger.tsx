import { Constraint } from '@commonalityco/types';
import { AccordionTrigger, Badge } from '@commonalityco/ui-design-system';
import { ShieldCheck, ShieldClose } from 'lucide-react';

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
          {variant === 'pass' ? (
            <ShieldCheck className="h-4 w-4" />
          ) : (
            <ShieldClose className="h-4 w-4" />
          )}
          <span className="truncate">{`#${constraint.applyTo}`}</span>
        </Badge>
        {children}
      </div>
    </AccordionTrigger>
  );
}
