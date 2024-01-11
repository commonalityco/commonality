import cytoscape, { ElementDefinition } from 'cytoscape';
import { layoutOptions } from './layout-options';
import dagre from 'cytoscape-dagre';
import { nodeStyles } from './styles/node';
import { edgeStyles } from './styles/edge';

cytoscape.use(dagre);

export type OffloadRenderFunction = ({
  elements,
}: {
  elements: ElementDefinition[];
}) => Promise<ElementDefinition[]>;

export const getElementDefinitionsWithUpdatedLayout: OffloadRenderFunction =
  async ({ elements }) => {
    const graph = cytoscape({
      styleEnabled: true,
      style: [...nodeStyles, ...edgeStyles],
      elements,
    });

    graph.layout(layoutOptions).run();

    return graph.elements().jsons() as unknown as ElementDefinition[];
  };

export default getElementDefinitionsWithUpdatedLayout;
