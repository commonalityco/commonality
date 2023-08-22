import cytoscape, { ElementDefinition } from 'cytoscape';
import { layoutOptions } from './layout-options.js';
import dagre from 'cytoscape-dagre';
import { nodeStyles } from './styles/node.js';
import { edgeStyles } from './styles/edge.js';

export type OffloadRenderFunction = ({
  elements,
}: {
  elements: ElementDefinition[];
}) => Promise<ElementDefinition[]>;

export const getElementDefinitionsWithUpdatedLayout: OffloadRenderFunction =
  async ({ elements }) => {
    cytoscape.use(dagre);

    const graph = cytoscape({
      styleEnabled: true,
      style: [...nodeStyles, ...edgeStyles],
      elements,
    });

    graph.layout(layoutOptions).run();

    return graph.elements().jsons() as unknown as ElementDefinition[];
  };

export default getElementDefinitionsWithUpdatedLayout;
