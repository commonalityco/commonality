'use client';
import { useMemo } from 'react';
import { EdgeProps, getBezierPath } from 'reactflow';
import clsx from 'clsx';
import { DependencyType, Dependency } from '@commonalityco/types';

export function DependencyEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  markerStart,
  markerEnd,
  interactionWidth = 12,
}: EdgeProps<Dependency>) {
  const [edgePath] = useMemo(
    () =>
      getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
      }),
    [sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition]
  );

  return (
    <g className="opacity-40 hover:opacity-100">
      {interactionWidth && (
        <path
          d={edgePath}
          fill="none"
          strokeWidth={interactionWidth}
          strokeLinecap="round"
          className={clsx(`peer stroke-transparent opacity-[15%]`, {
            'hover:stroke-green-600 dark:hover:stroke-green-700':
              data?.type === DependencyType.PRODUCTION,
            'hover:stroke-sky-600 dark:hover:stroke-sky-700':
              data?.type === DependencyType.DEVELOPMENT,
            'hover:stroke-violet-600 dark:hover:stroke-violet-700':
              data?.type === DependencyType.PEER,
          })}
        />
      )}
      <path
        id={id}
        className={clsx(
          `pointer-events-none fill-none stroke-1 dark:stroke-zinc-500`,
          {
            'stroke-green-600 dark:stroke-green-400':
              data?.type === DependencyType.PRODUCTION,
            'stroke-sky-600 dark:stroke-sky-400':
              data?.type === DependencyType.DEVELOPMENT,
            'stroke-violet-600 dark:stroke-violet-400':
              data?.type === DependencyType.PEER,
          }
        )}
        d={edgePath}
      />
    </g>
  );
}
