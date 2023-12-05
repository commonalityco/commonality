'use client';
import { Core, ElementDefinition } from 'cytoscape';
import { bindRenderGraphEvents } from './bind-render-graph-events';

import { ConstraintResult, Dependency } from '@commonalityco/types';

const updateStyles = ({
  graph,
  theme,
  results = [],
}: {
  graph: Core;
  theme: string;
  results: ConstraintResult[];
}) => {
  graph
    .elements()
    .removeClass(['dark', 'light', 'dim', 'focus'])
    .addClass(theme);

  for (const edge of graph.edges()) {
    const edgeData = edge.data() as Dependency;

    const resultForEdge = results.find((result) => {
      return result.dependencyPath.some((dep) => {
        return (
          dep.source === edgeData.source &&
          dep.target === edgeData.target &&
          edgeData.type === dep.type
        );
      });
    });

    if (resultForEdge) {
      if (resultForEdge.isValid) {
        edge.addClass(['pass']);
      } else {
        edge.addClass('fail');
      }
    }
  }
};

export const updateGraphElements = async ({
  renderGraph,
  traversalGraph,
  theme,
  forceEdgeColor,
  results,
  elements,
}: {
  renderGraph: Core;
  traversalGraph: Core;
  theme: string;
  forceEdgeColor: boolean;
  results: ConstraintResult[];
  elements: ElementDefinition[];
}) => {
  // Clear the graph
  renderGraph.json({ elements });

  updateStyles({ graph: renderGraph, theme, results });

  renderGraph.fit(undefined, 24);

  // Bind graph events, these events are all fired by the Cytoscape library
  bindRenderGraphEvents({
    renderGraph,
    theme,
    traversalGraph,
    results,
  });
};

export default updateGraphElements;
