import { Dependency, Package } from '@commonalityco/types';
import { uniqBy } from 'lodash';
import { EdgeDefinition, ElementDefinition, NodeDefinition } from 'cytoscape';

export const getGraphLayout = async (
  packages: Package[]
): Promise<ElementDefinition[]> => {
  const getIsInternalDependency = (dep: Dependency): boolean => {
    return packages.some((pkg) => pkg.name === dep.name);
  };

  try {
    const nodes: NodeDefinition[] = packages.map((pkg) => ({
      data: { ...pkg, id: pkg.name, width: pkg.name.length * 18, height: 100 },
    }));

    const nonUniqueEdges: EdgeDefinition[] = packages
      .map((pkg) => {
        const getEdge = (dependency: Dependency) => {
          return {
            data: {
              ...dependency,
              width: 1,
              id: `${pkg.name}->${dependency.name}`,
              source: pkg.name,
              target: dependency.name,
              controlPointDistances: '0.2 0.8',
            },
          };
        };

        const dependencies = pkg.dependencies
          .filter(getIsInternalDependency)
          .map(getEdge);

        const devDependencies = pkg.devDependencies
          .filter(getIsInternalDependency)
          .map(getEdge);
        const peerDependencies = pkg.peerDependencies
          .filter(getIsInternalDependency)
          .map(getEdge);

        return [...dependencies, ...devDependencies, ...peerDependencies];
      })
      .flat();

    const edges = uniqBy(nonUniqueEdges, 'data.id');

    return [...nodes, ...edges];
  } catch (error) {
    return [];
  }
};
