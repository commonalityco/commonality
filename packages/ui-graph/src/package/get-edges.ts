import { ConstraintResult, Dependency } from '@commonalityco/types';
import { DependencyType } from '@commonalityco/utils-core';
import { type Edge } from '@xyflow/react';
import { MarkerType } from '@xyflow/system';

const edgeType = 'dependency';

export type DependencyEdgeData = {
  dependency: Dependency;
  results: ConstraintResult[];
  theme: 'light' | 'dark';
  active: boolean;
  muted: boolean;
  activeDependencyTypes: DependencyType[];
};

export const getEdges = ({
  dependencies,
  results = [],
  theme,
  activeDependencyTypes = [],
}: {
  dependencies: Dependency[];
  results: ConstraintResult[];
  theme: 'light' | 'dark';
  activeDependencyTypes: DependencyType[];
}): Edge<DependencyEdgeData>[] => {
  return dependencies.map((dependency) => {
    return {
      id: `${dependency.source}-${dependency.target}-${dependency.type}`,
      source: dependency.source,
      target: dependency.target,
      sourceHandle: dependency.type,
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
        activeDependencyTypes,
      },
      type: edgeType,
      markerEnd: {
        type: MarkerType.ArrowClosed,
      },
    } satisfies Edge<DependencyEdgeData>;
  });
};
