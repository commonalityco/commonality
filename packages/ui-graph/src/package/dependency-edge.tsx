import { DependencyType } from '@commonalityco/utils-core';
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getBezierPath,
} from '@xyflow/react';
import { DependencyEdgeData } from './get-edges';
import { cn } from '@commonalityco/ui-design-system';

const TEXT_BY_TYPE = {
  [DependencyType.DEVELOPMENT]: 'dev',
  [DependencyType.PEER]: 'peer',
  [DependencyType.PRODUCTION]: 'prod',
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
  selected,
}: EdgeProps<DependencyEdgeData>) {
  const [edgePath, labelX, labelY] = getBezierPath({
    targetPosition,
    sourcePosition,
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const highlighted = data?.active || selected;

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        className={cn('transition stroke-1 duration-100', {
          'stroke-zinc-300 dark:stroke-zinc-800': !highlighted,
          'opacity-40': data?.muted,
          'stroke-[4px] opacity-100': highlighted,
          '!stroke-sky-600':
            highlighted && data?.dependency.type === DependencyType.DEVELOPMENT,
          '!stroke-purple-600':
            highlighted && data?.dependency.type === DependencyType.PEER,
          '!stroke-emerald-600':
            highlighted && data?.dependency.type === DependencyType.PRODUCTION,
        })}
      />
      <EdgeLabelRenderer>
        <span
          className={cn(
            'py-1 px-2 font-mono bg-interactive font-semibold transition rounded-md duration-100',
            {
              'opacity-0': !highlighted,
              'opacity-100': highlighted,
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
