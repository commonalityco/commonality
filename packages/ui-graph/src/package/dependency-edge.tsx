import { DependencyType } from '@commonalityco/utils-core';
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getBezierPath,
} from '@xyflow/react';
import { DependencyEdgeData } from './get-edges';
import { cn } from '@commonalityco/ui-design-system';
import { ShieldX } from 'lucide-react';

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

  const highlighted =
    data?.active ||
    data?.activeDependencyTypes.includes(data.dependency.type) ||
    selected;

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        className={cn(
          'stroke-1 transition duration-100',
          {
            'stroke-zinc-300 dark:stroke-zinc-800': !highlighted,
            'stroke-[2px] opacity-100': highlighted,
            'opacity-20': data?.muted,
            'stroke-purple-700 dark:stroke-purple-500':
              highlighted && data?.dependency.type === DependencyType.PEER,
            'stroke-sky-700 dark:stroke-sky-500':
              highlighted &&
              data?.dependency.type === DependencyType.DEVELOPMENT,
            'stroke-emerald-700 dark:stroke-emerald-500':
              highlighted &&
              data?.dependency.type === DependencyType.PRODUCTION,
          },
          {
            'stroke-red-600': data?.results.some((result) => !result.isValid),
          },
        )}
      />
      <EdgeLabelRenderer>
        <span
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: 'all',
          }}
          className={cn('transition duration-100', {
            'opacity-0': !highlighted,
            'opacity-100': highlighted,
            'opacity-20': highlighted && data?.muted,
          })}
        >
          {data?.results.some((result) => !result.isValid) ? (
            <span className="flex flex-nowrap items-center gap-1 rounded-full border-2 border-red-600 bg-red-100 px-2 py-0.5 font-mono font-semibold leading-none text-red-900 dark:bg-red-900 dark:text-red-100">
              <span>
                <ShieldX className="h-4 w-4" />
              </span>
              <span>{data?.results.length}</span>
            </span>
          ) : (
            <span
              className={cn(
                'rounded-full px-2 py-0.5 font-mono font-semibold leading-none',
                {
                  'border-2 border-sky-700 bg-sky-100 text-sky-900 dark:border-sky-500 dark:bg-sky-900 dark:text-sky-100':
                    highlighted &&
                    data?.dependency.type === DependencyType.DEVELOPMENT,
                  'border-2 border-purple-700 bg-purple-100 text-purple-900 dark:border-purple-500 dark:bg-purple-900 dark:text-purple-100':
                    highlighted &&
                    data?.dependency.type === DependencyType.PEER,
                  'border-2 border-emerald-700 bg-emerald-100 text-emerald-900 dark:border-emerald-500 dark:bg-emerald-900 dark:text-emerald-100':
                    highlighted &&
                    data?.dependency.type === DependencyType.PRODUCTION,
                },
              )}
            >
              {data?.dependency.type ? TEXT_BY_TYPE[data.dependency.type] : ''}
            </span>
          )}
        </span>
      </EdgeLabelRenderer>
    </>
  );
}
