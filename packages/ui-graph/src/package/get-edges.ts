import { ConstraintResult, Dependency } from '@commonalityco/types';
import { type Edge } from '@xyflow/react';
import { MarkerType } from '@xyflow/system';

const edgeType = 'dependency';

export type DependencyEdgeData = {
  dependency: Dependency;
  results: ConstraintResult[];
  theme: 'light' | 'dark';
  active: boolean;
  muted: boolean;
  forceActive: boolean;
};

export const getEdges = ({
  dependencies,
  results = [],
  theme,
}: {
  dependencies: Dependency[];
  results: ConstraintResult[];
  theme: 'light' | 'dark';
}): Edge<DependencyEdgeData>[] => {
  return dependencies.map((dependency) => {
    return {
      id: `${dependency.source}-${dependency.target}-${dependency.type}`,
      source: dependency.source,
      target: dependency.target,
      data: {
        results: results.filter((result) =>
          result.dependencyPath.some(
            (depPath) =>
              depPath.source === dependency.source &&
              depPath.target === dependency.target &&
              depPath.type === dependency.type,
          ),
        ),
        dependency,
        theme,
        active: false,
        muted: false,
        forceActive: false,
      },
      type: edgeType,
      markerEnd: {
        type: MarkerType.ArrowClosed,
      },
    } satisfies Edge<DependencyEdgeData>;
  });
};
