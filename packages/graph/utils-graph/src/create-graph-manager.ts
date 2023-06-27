import cytoscape, { Core, ElementDefinition, Stylesheet } from 'cytoscape';
import { createRenderGraph } from './create-render-graph';
import { renderElementsToGraph } from './render-elements-to-graph';
import { getUpdatedGraphJson } from './get-updated-graph-json';

export interface GraphManager {
  destroy: () => void;
}

export const createGraphManager = ({
  container,
  elements,
  onRender,
  theme,
  onLoad,
}: {
  container: HTMLElement;
  elements: ElementDefinition[];
  onRender: (graph: Core) => void;
  onLoad: () => void;
  theme: string;
  getUpdatedGraphJson: (options: {
    graphJson: Record<string, any>;
    stylesheets: Stylesheet[];
  }) => Record<string, any>;
}): GraphManager => {
  const traversalGraph = cytoscape({
    headless: true,
    elements,
  });
  const renderGraph = createRenderGraph({
    container,
    elements,
  });
  console.log('CREATED');

  renderElementsToGraph({
    renderGraph,
    traversalGraph,
    theme,
    elements,
    onRender,
    getUpdatedGraphJson,
    onLoad,
  });

  const destroy = () => {
    renderGraph?.removeAllListeners();
    renderGraph?.destroy();
    traversalGraph?.destroy();
  };

  return { destroy };
};
