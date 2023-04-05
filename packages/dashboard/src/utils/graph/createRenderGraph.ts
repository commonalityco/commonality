import { ThemeName } from 'constants/ThemeName';
import cytoscape, { Core, ElementDefinition } from 'cytoscape';
import { renderElementsToGraph } from './renderElementsToGraph';

interface CreateRenderGraphOptions {
  container: HTMLElement;
  elements: ElementDefinition[];
  onRender?: (graph: Core) => void;
  theme: ThemeName;
}

/**
 * Creates and renders a graph.
 */
export const createRenderGraph = ({
  container,
  elements,
  onRender = () => {},
  theme,
}: CreateRenderGraphOptions) => {
  const renderGraph = cytoscape({
    container,
    autoungrabify: true,
  });

  renderElementsToGraph({
    renderGraph,
    theme,
    elements,
    onRender,
  });

  return renderGraph;
};
