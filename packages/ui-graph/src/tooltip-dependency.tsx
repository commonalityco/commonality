'use client';
import {
  Accordion,
  AccordionContent,
  Badge,
  cn,
  ScrollArea,
  Separator,
} from '@commonalityco/ui-design-system';
import { Constraint, Dependency, Violation } from '@commonalityco/types';
import { CornerDownRight } from 'lucide-react';
import { DependencyType } from '@commonalityco/utils-core';
import { ConstraintAccordionItem } from './components/constraint-accordion-item.js';
import { ConstraintAccordionTrigger } from './components/constraint-accordion-trigger.js';
import { ConstraintResult } from './components/constraint-result.js';
import { GradientFade } from '@commonalityco/ui-core';

const TextByType = {
  [DependencyType.PRODUCTION]: 'Production',
  [DependencyType.DEVELOPMENT]: 'Development',
  [DependencyType.PEER]: 'Peer',
};

export interface TooltipDependencyProperties {
  dependency: Dependency;
  constraints: Constraint[];
  violations: Violation[];
}

export function TooltipDependency({
  dependency,
  constraints,
  violations,
}: TooltipDependencyProperties) {
  return (
    <div className="bg-background rounded-md p-1">
      <div className="px-2 py-1.5 mb-1">
        <div className="text-sm font-semibold">{dependency.source}</div>
        <div className="flex flex-nowrap items-center space-x-2">
          <CornerDownRight className="h-4 w-4" />
          <div className="text-sm font-semibold">{dependency.target}</div>
        </div>
      </div>
      <div className="px-2 max-w-xs flex-wrap">
        <Badge className="inline-flex gap-2 mr-1" variant="outline">
          <div
            className={cn('h-2 w-2 rounded-full', {
              'bg-green-600': dependency.type === DependencyType.PRODUCTION,
              'bg-blue-600': dependency.type === DependencyType.DEVELOPMENT,
              'bg-purple-600': dependency.type === DependencyType.PEER,
            })}
          />
          <span className="text-foreground font-medium leading-none py-1">
            {TextByType[dependency.type]}
          </span>
        </Badge>
        <span className="text-muted-foreground">
          dependency that allows versions within the range of{' '}
        </span>
        <span className="font-mono font-medium">{dependency.version}</span>
      </div>
      <Separator className="my-3" />
      <div className="grid h-full">
        <div className="px-2">
          <p className="font-semibold">Constraints</p>
        </div>

        <ScrollArea className="max-h-64 h-full px-2">
          <GradientFade placement="top" className="h-3" />
          <Accordion type="multiple">
            {constraints.length > 0 ? (
              constraints.map((constraint) => {
                const violation = violations.find(
                  (violation) => violation.appliedTo === constraint.applyTo,
                );
                return (
                  <div className="group" key={constraint.applyTo}>
                    <ConstraintAccordionItem
                      key={constraint.applyTo}
                      constraint={constraint}
                    >
                      <ConstraintAccordionTrigger
                        constraint={constraint}
                        variant={violation ? 'error' : 'pass'}
                        className="group-first:pt-0"
                      />
                      <AccordionContent>
                        <ConstraintResult
                          constraint={constraint}
                          violation={violation}
                        />
                      </AccordionContent>
                    </ConstraintAccordionItem>
                  </div>
                );
              })
            ) : (
              <p className="text-muted-foreground mt-1 text-xs">
                No constraints
              </p>
            )}
          </Accordion>
          <GradientFade placement="bottom" className="h-3" />
        </ScrollArea>
      </div>
    </div>
  );
}
