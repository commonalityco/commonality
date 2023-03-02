import cytoscape, {
  Collection,
  CollectionReturnValue,
  Core,
  ElementDefinition,
} from 'cytoscape';

export const createShadowGraphManager = () => {
  let _cy: Core | undefined;

  const init = ({ elements }: { elements: ElementDefinition[] }) => {
    _cy = cytoscape({
      headless: true,
      elements,
    });
  };

  const getAllPackages = (): CollectionReturnValue => {
    if (!_cy) {
      throw new Error('Graph has not been initialized yet');
    }

    return _cy.elements();
  };

  const getEmptyPackages = () => {
    if (!_cy) {
      throw new Error('Graph has not been initialized yet');
    }

    return _cy.collection();
  };

  return { init, getAllPackages, getEmptyPackages };
};
