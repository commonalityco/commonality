'use client';
import {
  Collection,
  CollectionArgument,
  Core,
  ElementDefinition,
  ElementsDefinition,
} from 'cytoscape';
import { bindRenderGraphEvents } from './bind-render-graph-events';
import { withTiming } from './utils/with-timing';
import { OffloadRenderFn, getUpdatedGraphJson } from './get-updated-graph-json';
import { DependencyType } from '@commonalityco/utils-core';
import { Dependency, Package, Violation } from '@commonalityco/types';

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

  graph.edges().forEach((edge) => {
    const edgeData = edge.data() as Dependency;

    const violationForEdge = edgeData
      ? violations.find((violation) => {
          const source: Package = edge.source().data();
          const target: Package = edge.target().data();

          console.log({ name: edgeData.name, source, target });
          return (
            violation.sourcePackageName === source.name &&
            violation.targetPackageName === target.name
          );
        })
      : null;

    if (forceEdgeColor) {
      edge.addClass(edgeData.type);
      edge.addClass('focus');
    } else {
      edge.removeClass(['DEVELOPMENT', 'PEER', 'PRODUCTION']);
      edge.removeClass('focus');
    }

    if (violationForEdge) {
      edge.removeClass(['DEVELOPMENT', 'PEER', 'PRODUCTION']);
      edge.removeClass('focus');

      edge.addClass('violation');
    }
  });
};

const renderElementsToGraph = withTiming(
  'renderElementsToGraph',
  async ({
    onRender,
    onLoad,
    renderGraph,
    traversalGraph,
    theme,
    elements,
    getUpdatedGraphJson,
    forceEdgeColor,
    violations,
  }: {
    onLoad: () => void;
    onRender: (graph: Core) => void;
    renderGraph: Core;
    traversalGraph: Core;
    theme: string;
    elements: ElementDefinition[];
    getUpdatedGraphJson: OffloadRenderFn;
    forceEdgeColor: boolean;
    violations: Violation[];
  }) => {
    onLoad?.();

    // Clear the graph
    renderGraph.elements().remove();
    renderGraph.elements().removeAllListeners();

    // Re-add all new elements to graph
    renderGraph.add(elements);

    updateStyles({ graph: renderGraph, theme, forceEdgeColor, violations });

    // Apply layout to graph
    const graphJson = await getUpdatedGraphJson({
      graphJson: renderGraph.json(),
    });

    renderGraph.ready(() => {
      renderGraph.json(graphJson);

      renderGraph.fit(undefined, 24);

      // Bind graph events, these events are all fired by the Cytoscape library
      bindRenderGraphEvents({
        renderGraph,
        theme,
        traversalGraph,
        violations,
      });

      onRender?.(renderGraph);
    });
  }
);

const updateGraphElements = withTiming(
  'updateGraphElements',
  async ({
    renderGraph,
    traversalGraph,
    elements,
    theme,
    forceEdgeColor,
    violations,
  }: {
    renderGraph: Core;
    traversalGraph: Core;
    elements:
      | ElementDefinition
      | ElementDefinition[]
      | ElementsDefinition
      | CollectionArgument;
    theme: string;
    getUpdatedGraphJson: OffloadRenderFn;
    forceEdgeColor: boolean;
    violations: Violation[];
  }) => {
    // Clear the graph
    renderGraph.elements().remove();
    renderGraph.elements().removeAllListeners();

    // Re-add all new elements to graph
    renderGraph.add(elements);

    updateStyles({ graph: renderGraph, theme, forceEdgeColor, violations });

    const graphJson = await getUpdatedGraphJson({
      graphJson: renderGraph.json(),
    });

    renderGraph.json(graphJson);

    renderGraph.fit(undefined, 24);

    // Bind graph events, these events are all fired by the Cytoscape library
    bindRenderGraphEvents({
      renderGraph,
      theme,
      traversalGraph,
    });
  }
);

export { renderElementsToGraph, updateGraphElements };
