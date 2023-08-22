import cytoscape, { ElementDefinition } from 'cytoscape';
import dagre from 'cytoscape-dagre';
import { nodeStyles } from './styles/node.js';
import { edgeStyles } from './styles/edge.js';
import popper from 'cytoscape-popper';

cytoscape.use(dagre);
cytoscape.use(popper);

interface CreateRenderGraphOptions {
  container: HTMLElement;
  elements: ElementDefinition[];
}

/**
 * Calculates the minZoom value based on the length of the elements array.
 */
const calculateMinZoom = (elementsLength: number) => {
  const minZoomBase = 0.1; // Change this value to set the minimum zoom level when the array is empty
  const minZoomFactor = 0.000_115; // Change this value to control the rate at which minZoom decreases as the array length increases

  return minZoomBase - elementsLength * minZoomFactor;
};

/**
 * Creates and renders a graph.
 */
export const createRenderGraph = ({
  container,
  elements,
}: CreateRenderGraphOptions) => {
  const renderGraph = cytoscape({
    container,
    style: [...nodeStyles, ...edgeStyles],
    autoungrabify: true,
    maxZoom: 2,
    minZoom: calculateMinZoom(elements.length),
    elements,
  });

  return renderGraph;
};

export default createRenderGraph;
