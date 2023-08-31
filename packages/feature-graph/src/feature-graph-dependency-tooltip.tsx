'use client';
import { TooltipDependency } from '@commonalityco/ui-graph';
import { GraphContext } from './graph-provider.js';
import {
  Constraint,
  Dependency,
  Package,
  TagsData,
  Violation,
} from '@commonalityco/types';
import { GraphTooltip } from '@commonalityco/ui-graph';
import { useMemo } from 'react';

export function FeatureGraphDependencyTooltip({
  constraints,
  violations,
  tagsData,
}: {
  constraints: Constraint[];
  violations: Violation[];
  tagsData: TagsData[];
}) {
  const selectedEdge = GraphContext.useSelector(
    (state) => state.context.selectedEdge,
  );
  const dependency: Dependency | undefined = selectedEdge?.data();
  const dependencyConstraints = useMemo(() => {
    if (!selectedEdge || !constraints) return [];

    const dependencyConstraints =
      constraints?.filter((constraint) => {
        const sourcePackage: Package = selectedEdge.source().data();
        const tagsForPackage = tagsData?.find(
          (data) => data.packageName === sourcePackage.name,
        );

        return tagsForPackage?.tags.includes(constraint.applyTo);
      }) ?? [];

    return dependencyConstraints;
  }, [selectedEdge, constraints]);

  return (
    <>
      {selectedEdge && dependency && (
        <GraphTooltip element={selectedEdge}>
          <TooltipDependency
            dependency={dependency}
            constraints={dependencyConstraints}
            violations={violations}
          />
        </GraphTooltip>
      )}
    </>
  );
}

export default FeatureGraphDependencyTooltip;
