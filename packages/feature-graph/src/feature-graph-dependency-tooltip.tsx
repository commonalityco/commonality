'use client';
import { TooltipDependency } from '@commonalityco/ui-graph';
import { GraphContext } from './graph-provider';
import { Dependency } from '@commonalityco/types';
import { GraphTooltip } from '@commonalityco/ui-graph';

export function FeatureGraphDependencyTooltip() {
  const selectedEdge = GraphContext.useSelector(
    (state) => state.context.selectedEdge,
  );
  const dependency: Dependency | undefined = selectedEdge?.data();

  return (
    <>
      {selectedEdge && dependency && (
        <GraphTooltip element={selectedEdge}>
          <TooltipDependency dependency={dependency} />
        </GraphTooltip>
      )}
    </>
  );
}

export default FeatureGraphDependencyTooltip;
