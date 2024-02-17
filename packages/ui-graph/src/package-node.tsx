import { Handle, Position, type NodeProps } from 'reactflow';
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
          'border border-border shadow rounded-md py-4 px-4 bg-background w-[300px] h-[90px] block overflow-hidden hover:border-muted-foreground/40 active:border-muted-foreground/80 transition',
          { 'opacity-10': data.muted },
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
            <div className="flex flex-nowrap items-center gap-2">
              <Icon className="h-6 w-6" />
              <p className="text-primary font-semibold text-sm leading-none">
                {data.package.name}
              </p>
            </div>
          </div>
          <div className="flex flex-nowrap items-center justify-between">
            <div className="flex flex-nowrap items-center gap-1">
              {data.tags.length > 0 ? (
                data.tags.map((tag, index) => (
                  <Badge variant="outline" key={index}>
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
