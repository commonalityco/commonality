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
          'transition stroke-1 duration-100',
          {
            'stroke-zinc-300 dark:stroke-zinc-800': !highlighted,
            'opacity-40': data?.muted,
            'stroke-[2px] opacity-100': highlighted,
            '!stroke-purple-600':
              highlighted && data?.dependency.type === DependencyType.PEER,
            '!stroke-sky-600':
              highlighted &&
              data?.dependency.type === DependencyType.DEVELOPMENT,
            '!stroke-emerald-600':
              highlighted &&
              data?.dependency.type === DependencyType.PRODUCTION,
          },
          {
            '!stroke-red-600': data?.results.length,
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
          })}
        >
          {data?.results.length ? (
            <span className="py-0.5 px-2 font-mono font-semibold rounded-full bg-red-100 text-red-900 dark:text-red-100 dark:bg-red-900 border-2 border-red-600 leading-none flex flex-nowrap gap-1 items-center">
              <span>
                <ShieldX className="w-4 h-4" />
              </span>
              <span>{data?.results.length}</span>
            </span>
          ) : (
            <span
              className={cn(
                'py-0.5 px-2 font-mono font-semibold rounded-full leading-none',
                {
                  'bg-sky-100 text-sky-900 dark:text-sky-100 dark:bg-sky-900 border-2 border-sky-600':
                    highlighted &&
                    data?.dependency.type === DependencyType.DEVELOPMENT,
                  'bg-purple-100 text-purple-900 dark:text-purple-100 dark:bg-purple-900 border-2 border-purple-600':
                    highlighted &&
                    data?.dependency.type === DependencyType.PEER,
                  'bg-emerald-100 text-emerald-900 dark:text-emerald-100 dark:bg-emerald-900 border-2 border-emerald-600':
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
