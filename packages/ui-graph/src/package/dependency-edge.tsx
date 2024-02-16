import { DependencyType } from '@commonalityco/utils-core';
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getBezierPath,
} from 'reactflow';
import { DependencyEdgeData } from './get-edges';
import { cn } from '@commonalityco/ui-design-system';

const TEXT_BY_TYPE = {
  [DependencyType.DEVELOPMENT]: 'dev',
  [DependencyType.PEER]: 'peer',
  [DependencyType.PRODUCTION]: 'prod',
};

const DEPENDENCY_COLOR_BY_TYPE = {
  [DependencyType.DEVELOPMENT]: '#0284c7',
  [DependencyType.PEER]: '#7c3aed',
  [DependencyType.PRODUCTION]: '#059669',
};

export function DependencyEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  data,
  targetPosition,
  sourcePosition,
  style,
}: EdgeProps<DependencyEdgeData>) {
  const [edgePath, labelX, labelY] = getBezierPath({
    targetPosition,
    sourcePosition,
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const getStyle = () => {
    const defaultStroke = data?.theme === 'light' ? '#d4d4d8' : '#27272a';

    if (data?.muted) {
      return {
        ...style,
        opacity: 0.1,
        stroke: defaultStroke,
      };
    }

    if (data?.active && data.dependency.type) {
      return {
        ...style,
        stroke: DEPENDENCY_COLOR_BY_TYPE[data.dependency.type],
        transitionProperty: 'stroke',
        transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
        transitionDuration: '150ms',
        strokeWidth: 4,
        opacity: 1,
      };
    }

    return {
      ...style,
      stroke: defaultStroke,
      transitionProperty: 'stroke',
      transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
      transitionDuration: '150ms',
      strokeWidth: 1,
      opacity: 1,
    };
  };

  return (
    <>
      <BaseEdge id={id} path={edgePath} style={getStyle()} />
      <EdgeLabelRenderer>
        <span
          className={cn(
            'py-1 px-2 font-mono bg-interactive font-semibold transition rounded-md text-xl',
            {
              'opacity-0': !data?.active,
              'opacity-100': data?.active,
            },
          )}
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: 'all',
          }}
        >
          {data?.dependency.type ? TEXT_BY_TYPE[data.dependency.type] : ''}
        </span>
      </EdgeLabelRenderer>
    </>
  );
}
