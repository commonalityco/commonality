import { Constraint } from '@commonalityco/types';
import { AccordionItem } from '@commonalityco/ui-design-system';

export function ConstraintAccordionItem({
  constraint,
  children,
}: {
  constraint: Constraint;
  children?: React.ReactNode;
}) {
  return (
    <AccordionItem className="grid w-full gap-2" value={constraint.tag}>
      {children}
    </AccordionItem>
  );
}
