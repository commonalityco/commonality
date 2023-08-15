'use client';
import { Core, ElementDefinition } from 'cytoscape';
import { bindRenderGraphEvents } from './bind-render-graph-events.js';

import { Dependency, Package, Violation } from '@commonalityco/types';
import { DependencyType } from '@commonalityco/utils-core';

const updateStyles = ({
  graph,
  theme,
  forceEdgeColor,
  violations = [],
}: {
  graph: Core;
  theme: string;
  forceEdgeColor: boolean;
  violations: Violation[];
}) => {
  graph.elements().removeClass(['dark', 'light']).addClass(theme);

  for (const edge of graph.edges()) {
    const edgeData = edge.data() as Dependency;

    const violationForEdge = edgeData
      ? violations.find((violation) => {
          const source: Package = edge.source().data();
          const target: Package = edge.target().data();

          return (
            violation.sourcePackageName === source.name &&
            violation.targetPackageName === target.name
          );
        })
      : undefined;

    if (forceEdgeColor) {
      edge.addClass(edgeData.type);
      edge.addClass('focus');
    } else {
      edge.removeClass([
        DependencyType.DEVELOPMENT,
        DependencyType.PEER,
        DependencyType.PRODUCTION,
      ]);
      edge.removeClass('focus');
    }

    if (violationForEdge) {
      edge.removeClass([
        DependencyType.DEVELOPMENT,
        DependencyType.PEER,
        DependencyType.PRODUCTION,
      ]);
      edge.removeClass('focus');

      edge.addClass('violation');
    }
  }
};

const updateGraphElements = async ({
  renderGraph,
  traversalGraph,
  theme,
  forceEdgeColor,
  violations,
  elements,
}: {
  renderGraph: Core;
  traversalGraph: Core;
  theme: string;
  forceEdgeColor: boolean;
  violations: Violation[];
  elements: ElementDefinition[];
}) => {
  // Clear the graph
  renderGraph.json({ elements });

  updateStyles({ graph: renderGraph, theme, forceEdgeColor, violations });

  renderGraph.fit(undefined, 24);

  // Bind graph events, these events are all fired by the Cytoscape library
  bindRenderGraphEvents({
    renderGraph,
    theme,
    traversalGraph,
    violations,
  });
};

export { updateGraphElements };
