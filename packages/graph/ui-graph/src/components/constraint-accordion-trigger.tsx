import { Constraint, Violation } from '@commonalityco/types';
import { ConstraintTag } from './constraint-tag';

export function ConstraintAccordionTrigger({
  constraint,
  violations = [],
  variant,
}: {
  constraint: Constraint;
  violations?: Violation[];
  variant: 'pass' | 'error';
}) {
  return (
    <div className="text-left">
      <ConstraintTag constraint={constraint} variant={variant} />
      <p className="mt-1 text-left text-xs text-muted-foreground">{`${
        violations.length ?? 0
      } violations`}</p>
    </div>
  );
}
