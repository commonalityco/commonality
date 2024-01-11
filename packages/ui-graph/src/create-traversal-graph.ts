import cytoscape, { Core, ElementDefinition } from 'cytoscape';

export const createTraversalGraph = ({
  elements,
}: {
  elements: ElementDefinition[];
}): Core =>
  cytoscape({
    headless: true,
    elements,
  });

export default createTraversalGraph;
