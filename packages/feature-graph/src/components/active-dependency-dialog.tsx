/* eslint-disable unicorn/no-null */
'use client';
import { useAtom } from 'jotai';
import { ConstraintResult } from '@commonalityco/types';
import { useStore } from '@xyflow/react';
import { DependencyDialog } from './dependency-dialog';
import { ConstraintsDialog } from './constraints-dialog';
import { activeDependencyAtom } from '../atoms/graph-atoms';

export function ActiveDependencyDialog({
  results,
}: {
  results: ConstraintResult[];
}) {
  const resetSelectedElements = useStore(
    (state) => state.resetSelectedElements,
  );
  const [activeDependency, setActiveDependency] = useAtom(activeDependencyAtom);

  const resultForDependency = results.find((result) =>
    result.dependencyPath.some(
      (depPath) =>
        depPath.source === activeDependency?.source &&
        depPath.target === activeDependency?.target,
    ),
  );

  if (!activeDependency) return;

  if (resultForDependency) {
    return (
      <ConstraintsDialog
        open
        onOpenChange={(open: boolean) => {
          if (!open) {
            resetSelectedElements();
            setActiveDependency(null);
          }
        }}
        result={resultForDependency}
      />
    );
  }

  return (
    <DependencyDialog
      dependency={activeDependency}
      open={Boolean(activeDependency)}
      onOpenChange={(open) => {
        if (!open) {
          resetSelectedElements();
          setActiveDependency(null);
        }
      }}
    />
  );
}
