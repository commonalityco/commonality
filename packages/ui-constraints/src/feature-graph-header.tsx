'use client';
import { ConstraintResult } from '@commonalityco/types';
import { GraphContext } from '@commonalityco/ui-graph';
import GraphHeader from './graph-header';

export function FeatureGraphHeader({
  results,
  children,
}: {
  results: ConstraintResult[];
  children?: React.ReactNode;
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
    >
      {children}
    </GraphHeader>
  );
}
