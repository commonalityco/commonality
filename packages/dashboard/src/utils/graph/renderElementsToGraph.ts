import { ThemeName } from 'constants/ThemeName';
import { Core, ElementDefinition, ElementsDefinition } from 'cytoscape';
import { bindRenderGraphEvents } from 'utils/graph/bindRenderGraphEvents';
import { updateNodeStyles } from 'utils/graph/updateNodeStyles';
import { withTiming } from 'utils/with-timing';

const worker = new Worker(new URL('./graph.worker.ts', import.meta.url));

export const renderElementsToGraph = withTiming(
  'renderElementsToGraph',
  ({
    onRender = () => {},
    renderGraph,
    theme,
    elements,
  }: {
    onRender?: (graph: Core) => void;
    renderGraph: Core;
    theme: ThemeName;
    elements: ElementDefinition | ElementDefinition[] | ElementsDefinition;
  }) => {
    worker.postMessage({
      type: 'runLayout',
      elements,
      theme,
    });

    worker.onmessage = (event: MessageEvent) => {
      const { json, type } = event.data;

      if (type === 'layoutCalculated') {
        renderGraph.json(json);
        updateNodeStyles(renderGraph);
        bindRenderGraphEvents({ renderGraph, theme });
        onRender(renderGraph);
      }
    };
  }
);
