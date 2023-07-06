import { ShieldClose, ShieldCheck } from 'lucide-react';
import { Constraint } from '@commonalityco/types';
import { Tag } from '@commonalityco/ui-design-system';

export function ConstraintTag({
  constraint,
  variant,
}: {
  constraint: Constraint;
  variant: 'pass' | 'error';
}) {
  return (
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
  );
}
