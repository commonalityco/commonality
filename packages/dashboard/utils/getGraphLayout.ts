import { Dependency, Package } from '@commonalityco/types';
import ELK from 'elkjs';
import type { ElkExtendedEdge, ElkNode } from 'elkjs';
import type { Edge, Node, MarkerType } from 'reactflow';
import { uniqBy } from 'lodash';
import cytoscape, {
  EdgeDefinition,
  ElementDefinition,
  NodeDefinition,
} from 'cytoscape';

const NODE_WIDTH = 300;
const NODE_HEIGHT = 108;

export const getGraphLayout = async (
  packages: Package[]
): Promise<ElementDefinition[]> => {
  const getIsInternalDependency = (dep: Dependency): boolean => {
    return packages.some((pkg) => pkg.name === dep.name);
  };

  try {
    const nodes: NodeDefinition[] = packages.map((pkg) => ({
      data: { id: pkg.name, ...pkg },
    }));

    const nonUniqueEdges: EdgeDefinition[] = packages
      .map((pkg) => {
        const getEdge = (dependency: Dependency) => {
          return {
            data: {
              id: `${pkg.name}-${dependency.name}`,
              source: pkg.name,
              target: dependency.name,
              controlPointDistances: '0 0',
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
    console.log({ error });
    return [];
  }
};
