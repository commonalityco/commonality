import { Constraint, Dependency, Violation } from '@commonalityco/types';
import {
  Accordion,
  Label,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@commonalityco/ui-design-system';
import { DependencyType } from '@commonalityco/utils-core';
import { cva } from 'class-variance-authority';
import { CornerDownRight } from 'lucide-react';
import { ComponentProps } from 'react';
import { ConstraintAccordionContent } from './components/constraint-accordion-content';
import { ConstraintAccordionItem } from './components/constraint-accordion-item';
import { ConstraintAccordionTrigger } from './components/constraint-accordion-trigger';

const statusDotStyles = cva('h-2 w-2 rounded-full', {
  variants: {
    type: {
      PRODUCTION: 'bg-green-600',
      DEVELOPMENT: 'bg-blue-600',
      PEER: 'bg-purple-600',
    },
  },
});

const TextByType: Record<DependencyType, string> = {
  [DependencyType.PRODUCTION]: 'Production',
  [DependencyType.DEVELOPMENT]: 'Development',
  [DependencyType.PEER]: 'Peer',
};

function DependencySheetContent({
  constraints,
  violations,
  dependency,
  source,
  target,
}: {
  constraints: Constraint[];
  violations: Violation[];
  dependency: Dependency;
  target: string;
  source: string;
}) {
  return (
    <>
      <SheetHeader>
        <p className="text-muted-foreground text-xs">Dependency</p>
        <SheetTitle className="grid gap-1">
          <span>{source}</span>
          <div className="flex flex-nowrap items-center gap-2">
            <CornerDownRight className="h-4 w-4" />
            <span>{target}</span>
          </div>
        </SheetTitle>
      </SheetHeader>
      <div className="grid gap-4 pt-4">
        <div>
          <Label className="mb-2">Type</Label>
          <div className="flex flex-nowrap items-center gap-2">
            <div className={statusDotStyles({ type: dependency.type })} />
            <p className="text-xs">{TextByType[dependency.type]}</p>
          </div>
        </div>
        <div>
          <Label className="mb-2">Version range</Label>
          <p className="text-xs">
            {dependency.version ? (
              <span className="font-mono">{dependency.version}</span>
            ) : (
              'No version'
            )}
          </p>
        </div>
        <div>
          <Label>Constraints</Label>
          <Accordion type="multiple">
            {constraints.length ? (
              constraints.map((constraint) => {
                const hasViolation = violations.some(
                  (violation) => violation.constraintTag === constraint.tag
                );
                return (
                  <ConstraintAccordionItem
                    key={constraint.tag}
                    constraint={constraint}
                  >
                    <ConstraintAccordionTrigger
                      constraint={constraint}
                      variant={hasViolation ? 'error' : 'pass'}
                    />
                    <ConstraintAccordionContent constraint={constraint} />
                  </ConstraintAccordionItem>
                );
              })
            ) : (
              <p className="text-muted-foreground mt-1 text-xs">
                No constraints
              </p>
            )}
          </Accordion>
        </div>
      </div>
    </>
  );
}

interface DependencySheetProps extends ComponentProps<typeof Sheet> {
  constraints: Constraint[];
  violations: Violation[];
  dependency?: Dependency;
  target: string;
  source: string;
}

export function DependencySheet(props: DependencySheetProps) {
  return (
    <Sheet {...props}>
      <SheetContent className="sm:max-w-[300px] md:max-w-[550px]">
        {props.dependency && (
          <DependencySheetContent
            constraints={props.constraints}
            violations={props.violations}
            dependency={props.dependency}
            target={props.target}
            source={props.source}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}
