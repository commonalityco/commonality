import { Constraint } from '@commonalityco/types';
import { AccordionTrigger, Tag } from '@commonalityco/ui-design-system';
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
        <Tag
          className="grid grid-cols-[auto_1fr] gap-1"
          use={variant === 'pass' ? 'success' : 'destructive'}
        >
          {variant === 'pass' ? (
            <ShieldCheck className="h-4 w-4" />
          ) : (
            <ShieldClose className="h-4 w-4" />
          )}
          <span className="truncate">{`#${constraint.tag}`}</span>
        </Tag>
        {children}
      </div>
    </AccordionTrigger>
  );
}
