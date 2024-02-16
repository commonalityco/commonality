import { Dependency, Package } from '@commonalityco/types';
import { MarkerType, type Edge } from 'reactflow';

const edgeType = 'dependency';

export type DependencyEdgeData = {
  dependency: Dependency;
  theme: 'light' | 'dark';
  active: boolean;
  muted: boolean;
};

export const getEdges = ({
  dependencies,
  packages,
  theme,
}: {
  dependencies: Dependency[];
  packages: Package[];
  theme: 'light' | 'dark';
}): Edge<DependencyEdgeData>[] => {
  return dependencies.map((dependency) => {
    const weight = packages.filter(
      (pkg) => pkg.name === dependency.source,
    ).length;

    return {
      id: `${dependency.source}-${dependency.target}-${dependency.type}`,
      source: dependency.source,
      target: dependency.target,
      data: { dependency, theme, active: false, muted: false },
      weight: weight * 10,
      type: edgeType,
      markerEnd: {
        type: MarkerType.ArrowClosed,
      },
    };
  });
};
