import React from 'react';
import { Constraint, Dependency, Violation } from '@commonalityco/types';
import {
  Accordion,
  AccordionContent,
  cn,
  Label,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@commonalityco/ui-design-system';
import { DependencyType } from '@commonalityco/utils-core';
import { CornerDownRight } from 'lucide-react';
import { ComponentProps } from 'react';
import { ConstraintResult } from './components/constraint-result';
import { ConstraintAccordionItem } from './components/constraint-accordion-item';
import { ConstraintAccordionTrigger } from './components/constraint-accordion-trigger';

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
          <div className="flex flex-nowrap items-center space-x-2">
            <CornerDownRight className="h-4 w-4" />
            <span>{target}</span>
          </div>
        </SheetTitle>
      </SheetHeader>
      <div className="space-y-4 pt-4">
        <div className="space-y-1">
          <Label>Type</Label>
          <div className="flex flex-nowrap items-center space-x-2">
            <div
              className={cn('h-2 w-2 rounded-full', {
                'bg-green-600': dependency.type === DependencyType.PRODUCTION,
                'bg-blue-600': dependency.type === DependencyType.DEVELOPMENT,
                'bg-purple-600': dependency.type === DependencyType.PEER,
              })}
            />
            <p>{TextByType[dependency.type]}</p>
          </div>
        </div>
        <div className="space-y-1">
          <Label>Version range</Label>
          <p>
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
                const violation = violations.find(
                  (violation) => violation.appliedTo === constraint.applyTo
                );
                return (
                  <ConstraintAccordionItem
                    key={constraint.applyTo}
                    constraint={constraint}
                  >
                    <ConstraintAccordionTrigger
                      constraint={constraint}
                      variant={violation ? 'error' : 'pass'}
                    />
                    <AccordionContent>
                      <ConstraintResult
                        constraint={constraint}
                        violation={violation}
                      />
                    </AccordionContent>
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
      <SheetContent className="sm:max-w-[300px] md:max-w-[450px]">
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
