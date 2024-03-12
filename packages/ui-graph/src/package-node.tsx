import { Handle, type NodeProps } from '@xyflow/react';
import { Position } from '@xyflow/system';
import { PackageNodeData } from './package/get-nodes';
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
    <div style={{ height, width }} className="py-2 rounded-lg group w-full">
      <div
        className={cn(
          'w-full border border-muted-foreground/20 shadow-[0_0_0_12px_rgba(0,0,0,0.025)] dark:shadow-[0_0_0_12px_rgba(255,255,255,0.025)] group-hover:shadow-[0_0_0_12px_rgba(0,0,0,0.065)] dark:group-hover:shadow-[0_0_0_12px_rgba(255,255,255,0.065)] rounded-md py-2 px-4 bg-muted block overflow-hidden group-hover:border-muted-foreground/60 group-active:border-muted-foreground/100 transition duration-100 h-full w-full',
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

        <div className="w-full flex items-center gap-3 flex-nowrap justify-between">
          <p className="text-primary font-semibold text-lg leading-none truncated truncate min-w-0">
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
