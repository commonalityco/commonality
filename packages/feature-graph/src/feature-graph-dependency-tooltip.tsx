'use client';
import { TooltipDependency } from './components/tooltip-dependency';
import { GraphContext } from './graph-provider';
import { Dependency } from '@commonalityco/types';
import { GraphTooltip } from '@commonalityco/ui-graph';

export function FeatureGraphDependencyTooltip() {
  const selectedEdge = GraphContext.useSelector(
    (state) => state.context.selectedEdge,
  );
  const data: { id: string; dependencies: Dependency[] } | undefined =
    selectedEdge?.data();

  const results = GraphContext.useSelector((state) => state.context.results);

  const resultsForEdge = results.filter((result) => {
    return result.dependencyPath.some((depPath) => {
      return (
        depPath.source === data?.dependencies[0]?.source &&
        depPath.target === data?.dependencies[0]?.target
      );
    });
  });
  // console.log('results: ', results);
  // console.log('dependency: ', dependency);
  // console.log('selectedEdge: ', selectedEdge?.data());
  return (
    <>
      {selectedEdge && data && (
        <GraphTooltip element={selectedEdge}>
          <TooltipDependency
            dependencies={data.dependencies}
            results={resultsForEdge}
          />
        </GraphTooltip>
      )}
    </>
  );
}

export default FeatureGraphDependencyTooltip;
