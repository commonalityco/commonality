'use client';
import { ConstraintResult, Dependency } from '@commonalityco/types';
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  ScrollArea,
} from '@commonalityco/ui-design-system';
import { ConstraintContent } from './constraint-results';
import { DependencyType } from '@commonalityco/utils-core';
import { CornerDownRight } from 'lucide-react';
import { ComponentProps } from 'react';

const TextByType = {
  [DependencyType.PRODUCTION]: 'production',
  [DependencyType.DEVELOPMENT]: 'development',
  [DependencyType.PEER]: 'peer',
};

export function DependencyConstraintsDialog({
  dependencies,
  results,
  ...props
}: ComponentProps<typeof Dialog> & {
  dependencies: Dependency[];
  results: ConstraintResult[];
}) {
  return (
    <Dialog {...props}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <div className="flex flex-col gap-2">
              <span>{dependencies[0]?.source}</span>
              <div className="flex flex-nowrap items-center space-x-2">
                <CornerDownRight className="h-4 w-4" />
                <span>{dependencies[0]?.target}</span>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[450px]">
          <div className="flex flex-col gap-4 py-4">
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
              const isValid = resultsForDependency.every(
                (result) => result.isValid,
              );

              return (
                <div key={key}>
                  <div className="flex gap-4 items-center mb-3">
                    {isValid ? (
                      <span className="text-success font-medium font-mono">
                        pass
                      </span>
                    ) : (
                      <span className="text-destructive font-medium font-mono">
                        fail
                      </span>
                    )}
                    <p className="font-medium font-mono">
                      {`${TextByType[dependency.type]} `}
                      <span className="text-muted-foreground">
                        {dependency.version}
                      </span>
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    {resultsForDependency.length > 0 ? (
                      resultsForDependency.map((result) => (
                        <ConstraintContent result={result} />
                      ))
                    ) : (
                      <p className="text-muted-foreground text-xs mt-2">
                        No constraints for dependency
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => props.onOpenChange?.(false)}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
