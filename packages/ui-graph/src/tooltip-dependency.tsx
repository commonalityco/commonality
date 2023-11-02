'use client';
import { Badge, cn, Separator } from '@commonalityco/ui-design-system';
import { Dependency } from '@commonalityco/types';
import { CornerDownRight } from 'lucide-react';
import { DependencyType } from '@commonalityco/utils-core';

const TextByType = {
  [DependencyType.PRODUCTION]: 'Production',
  [DependencyType.DEVELOPMENT]: 'Development',
  [DependencyType.PEER]: 'Peer',
};

export interface TooltipDependencyProperties {
  dependency: Dependency;
}

export function TooltipDependency({ dependency }: TooltipDependencyProperties) {
  return (
    <div className="bg-background rounded-md p-1">
      <div className="px-2 py-1.5 mb-1">
        <div className="text-sm font-semibold">{dependency.source}</div>
        <div className="flex flex-nowrap items-center space-x-2">
          <CornerDownRight className="h-4 w-4" />
          <div className="text-sm font-semibold">{dependency.target}</div>
        </div>
      </div>
      <div className="px-2 max-w-xs flex-wrap">
        <Badge className="inline-flex gap-2 mr-1" variant="outline">
          <div
            className={cn('h-2 w-2 rounded-full', {
              'bg-green-600': dependency.type === DependencyType.PRODUCTION,
              'bg-blue-600': dependency.type === DependencyType.DEVELOPMENT,
              'bg-purple-600': dependency.type === DependencyType.PEER,
            })}
          />
          <span className="text-foreground font-medium leading-none py-1">
            {TextByType[dependency.type]}
          </span>
        </Badge>
        <span className="text-muted-foreground">
          dependency that allows versions within the range of{' '}
        </span>
        <span className="font-mono font-medium">{dependency.version}</span>
      </div>
      <Separator className="my-3" />
    </div>
  );
}
