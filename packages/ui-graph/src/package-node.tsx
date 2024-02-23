import { Handle, type NodeProps } from '@xyflow/react';
import { Position } from '@xyflow/system';
import { PackageNodeData } from './package/get-nodes';
import { getIconForPackage } from '@commonalityco/ui-core';
import { formatTagName } from '@commonalityco/utils-core';
import { Badge, cn } from '@commonalityco/ui-design-system';

export function PackageNode({
  isConnectable,
  data,
  ...rest
}: NodeProps<PackageNodeData>) {
  const Icon = getIconForPackage(data.package.type);

  return (
    <div>
      <div
        className={cn(
          'border border-border shadow rounded-md py-4 px-4 bg-background block overflow-hidden hover:border-muted-foreground/40 active:border-muted-foreground/80 transition duration-100',
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
