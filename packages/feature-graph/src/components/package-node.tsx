import { Handle, type NodeProps } from '@xyflow/react';
import { Position } from '@xyflow/system';
import { PackageNodeData } from '../utilities/get-nodes';
import { getIconForPackage } from '@commonalityco/ui-core';
import { cn } from '@commonalityco/ui-design-system';
import { DependencyType } from '@commonalityco/utils-core';

export function PackageNode({
  isConnectable,
  data,
  width,
  height,
  ...rest
}: NodeProps<PackageNodeData>) {
  const Icon = getIconForPackage(data.package.type);

  return (
    <div style={{ height, width }} className="group w-full rounded-lg py-2">
      <div
        className={cn(
          'border-muted-foreground/20 bg-muted group-hover:border-muted-foreground/60 group-active:border-muted-foreground/100 block h-full w-full w-full overflow-hidden rounded-md border px-4 py-2 shadow-[0_0_0_12px_rgba(0,0,0,0.025)] transition duration-100 group-hover:shadow-[0_0_0_12px_rgba(0,0,0,0.065)] dark:shadow-[0_0_0_12px_rgba(255,255,255,0.025)] dark:group-hover:shadow-[0_0_0_12px_rgba(255,255,255,0.065)]',
          { 'opacity-10': data.muted, 'opacity-100': !data.muted },
        )}
      >
        {data.input ? (
          <Handle
            type="target"
            position={rest.targetPosition ?? Position.Top}
            isConnectable={isConnectable}
          />
        ) : undefined}

        <div className="flex w-full flex-nowrap items-center justify-between gap-3">
          <p className="text-primary truncated min-w-0 truncate text-lg font-semibold leading-none">
            {data.package.name}
          </p>
          <Icon className="h-8 w-8 shrink-0" />
        </div>

        {data.output ? (
          <>
            <Handle
              className={cn({
                'left-[45%]': rest.sourcePosition === Position.Bottom,
                'top-[30%]': rest.sourcePosition === Position.Right,
              })}
              type="source"
              id={DependencyType.PRODUCTION}
              position={rest.sourcePosition ?? Position.Bottom}
            />
            <Handle
              type="source"
              position={rest.sourcePosition ?? Position.Bottom}
              id={DependencyType.DEVELOPMENT}
            />
            <Handle
              className={cn({
                'left-[55%]': rest.sourcePosition === Position.Bottom,
                'top-[70%]': rest.sourcePosition === Position.Right,
              })}
              type="source"
              position={rest.sourcePosition ?? Position.Bottom}
              id={DependencyType.PEER}
            />
          </>
        ) : undefined}
      </div>
    </div>
  );
}
