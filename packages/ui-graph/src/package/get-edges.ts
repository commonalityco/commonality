import { Dependency } from '@commonalityco/types';
import { type Edge } from '@xyflow/react';
import { MarkerType } from '@xyflow/system';

const edgeType = 'dependency';

export type DependencyEdgeData = {
  dependency: Dependency;
  theme: 'light' | 'dark';
  active: boolean;
  muted: boolean;
  // weight: number;
};

export const getEdges = ({
  dependencies,
  theme,
}: {
  dependencies: Dependency[];
  theme: 'light' | 'dark';
}): Edge<DependencyEdgeData>[] => {
  return dependencies.map((dependency) => {
    return {
      id: `${dependency.source}-${dependency.target}-${dependency.type}`,
      source: dependency.source,
      target: dependency.target,
      data: {
        dependency,
        theme,
        active: false,
        muted: false,
      },
      type: edgeType,
      markerEnd: {
        type: MarkerType.ArrowClosed,
      },
    } satisfies Edge<DependencyEdgeData>;
  });
};
