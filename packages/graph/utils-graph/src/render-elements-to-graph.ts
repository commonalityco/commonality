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

const updateNodeStyles = ({ graph, theme }: { graph: Core; theme: string }) => {
  graph.elements().removeClass(['dark', 'light']).addClass(theme);
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
  }: {
    onLoad: () => void;
    onRender: (graph: Core) => void;
    renderGraph: Core;
    traversalGraph: Core;
    theme: string;
    elements: ElementDefinition[];
    getUpdatedGraphJson: OffloadRenderFn;
  }) => {
    onLoad?.();

    // Clear the graph
    renderGraph.elements().remove();
    renderGraph.elements().removeAllListeners();

    // Re-add all new elements to graph
    renderGraph.add(elements);

    updateNodeStyles({ graph: renderGraph, theme });

    // Apply layout to graph
    const graphJson = await getUpdatedGraphJson({
      graphJson: renderGraph.json(),
    });

    renderGraph.ready(() => {
      console.log('RENDERING');
      renderGraph.json(graphJson);

      renderGraph.fit(undefined, 24);

      // Bind graph events, these events are all fired by the Cytoscape library
      bindRenderGraphEvents({
        renderGraph,
        theme,
        traversalGraph,
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
  }) => {
    // Clear the graph
    renderGraph.elements().remove();
    renderGraph.elements().removeAllListeners();

    // Re-add all new elements to graph
    renderGraph.add(elements);

    updateNodeStyles({ graph: renderGraph, theme });

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
