import { Handle, type NodeProps } from '@xyflow/react';
import { Position } from '@xyflow/system';
import { PackageNodeData } from './package/get-nodes';
import { getIconForPackage } from '@commonalityco/ui-core';
import { formatTagName } from '@commonalityco/utils-core';
import { Badge, cn } from '@commonalityco/ui-design-system';

export function PackageNode({
  isConnectable,
  data,
  width,
  height,
  ...rest
}: NodeProps<PackageNodeData>) {
  const Icon = getIconForPackage(data.package.type);

  return (
    <div style={{ height, width }} className="p-2 rounded-lg group">
      <div
        className={cn(
          'border border-border shadow-[0_0_0_12px_rgba(0,0,0,0.025)] dark:shadow-[0_0_0_12px_rgba(255,255,255,0.025)] group-hover:shadow-[0_0_0_12px_rgba(0,0,0,0.065)] dark:group-hover:shadow-[0_0_0_12px_rgba(255,255,255,0.065)] rounded-md p-4 bg-background block overflow-hidden group-hover:border-muted-foreground group-active:border-muted-foreground/80 transition duration-100 h-full w-full',
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
        <div className="grid gap-4">
          <div className="flex flex-nowrap items-center justify-between">
            <div className="flex flex-nowrap items-center gap-4">
              <Icon className="h-8 w-8" />
              <p className="text-primary font-semibold leading-none truncated min-w-0">
                {data.package.name}
              </p>
            </div>
          </div>
          <div className="flex flex-nowrap items-center justify-between">
            <div className="flex flex-nowrap items-center gap-1">
              {data.tags.length > 0 ? (
                data.tags.map((tag, index) => (
                  <Badge variant="secondary" key={index}>
                    {formatTagName(tag)}
                  </Badge>
                ))
              ) : (
                <p className="text-xs text-muted-foreground leading-none">
                  No tags
                </p>
              )}
            </div>
          </div>
        </div>
        {data.output ? (
          <Handle
            type="source"
            position={rest.sourcePosition ?? Position.Bottom}
            id="b"
            isConnectable={isConnectable}
          />
        ) : undefined}
      </div>
    </div>
  );
}
