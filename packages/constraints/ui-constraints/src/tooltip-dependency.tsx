'use client';
import { ConstraintResult, Dependency } from '@commonalityco/types';
import { CornerDownRight } from 'lucide-react';
import { DependencyType } from '@commonalityco/utils-core';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  ScrollArea,
} from '@commonalityco/ui-design-system';
import { ConstraintContent, FilterTitle } from './constraint-results';

const TextByType = {
  [DependencyType.PRODUCTION]: 'production',
  [DependencyType.DEVELOPMENT]: 'development',
  [DependencyType.PEER]: 'peer',
};

export interface TooltipDependencyProperties {
  dependencies: Dependency[];
  results: ConstraintResult[];
}

export function TooltipDependency({
  dependencies,
  results,
}: TooltipDependencyProperties) {
  const firstDependency = dependencies[0];

  return (
    <ScrollArea className="bg-background rounded-md p-1 w-80 max-h-80 overflow-auto">
      <div className="px-2 py-1.5 mb-1">
        <p className="text-sm font-semibold">{firstDependency.source}</p>
        <div className="flex flex-nowrap items-center space-x-2">
          <CornerDownRight className="h-4 w-4" />
          <p className="text-sm font-semibold">{firstDependency.target}</p>
        </div>
        <div className="flex flex-col gap-4 mt-4">
          {dependencies.map((dependency) => {
            const resultsForDependency = results.filter((result) =>
              result.dependencyPath.some(
                (dep) =>
                  dep.source === dependency.source &&
                  dep.target === dependency.target &&
                  dep.type === dependency.type,
              ),
            );
            const key = `${dependency.source}-${dependency.target}-${dependency.type}`;
            return (
              <Accordion type="multiple" key={key}>
                <div className="flex gap-2 flex-nowrap items-center">
                  <p className="font-medium font-mono text-xs">
                    {`${TextByType[dependency.type]} `}
                    <span className="text-muted-foreground">
                      {dependency.version}
                    </span>
                  </p>
                </div>
                <div>
                  <div className="flex flex-col gap-2">
                    {resultsForDependency.length > 0 ? (
                      resultsForDependency.map((result) => (
                        <AccordionItem
                          value={result.filter}
                          key={result.filter}
                          className="space-y-2"
                        >
                          <AccordionTrigger></AccordionTrigger>
                          <AccordionContent>
                            <ConstraintContent result={result} />
                          </AccordionContent>
                        </AccordionItem>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-xs mt-2">
                        No constraints for dependency
                      </p>
                    )}
                  </div>
                </div>
              </Accordion>
            );
          })}
        </div>
      </div>
    </ScrollArea>
  );
}
