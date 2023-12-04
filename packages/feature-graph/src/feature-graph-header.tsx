'use client';
import { ConstraintResult } from '@commonalityco/types';
import { GraphContext } from './graph-provider';
import GraphHeader from './components/graph-header';

export function FeatureGraphHeader({
  results,
}: {
  results: ConstraintResult[];
}) {
  const totalCount = GraphContext.useSelector((state) => {
    return state.context.traversalGraph
      ? state.context.traversalGraph.nodes().length
      : 0;
  });

  const shownCount = GraphContext.useSelector((state) =>
    state.context.renderGraph
      ? state.context.renderGraph.nodes().length
      : totalCount,
  );

  return (
    <GraphHeader
      totalCount={totalCount}
      shownCount={shownCount}
      results={results}
    />
  );
}
