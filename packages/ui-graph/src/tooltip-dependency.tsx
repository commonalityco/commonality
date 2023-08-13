'use client';
import { cn, Heading, Label, Text } from '@commonalityco/ui-design-system';
import { Dependency } from '@commonalityco/types';
import { ArrowRight } from 'lucide-react';
import { GraphTooltip, GraphTooltipProps } from './components/graph-tooltip';
import { useState } from 'react';
import { DependencyType } from '@commonalityco/utils-core';

const TextByType = {
  [DependencyType.PRODUCTION]: 'Production',
  [DependencyType.DEVELOPMENT]: 'Development',
  [DependencyType.PEER]: 'Peer',
};

export interface TooltipDependencyProperties {
  edge: GraphTooltipProps['element'];
}

export function TooltipDependency({ edge }: TooltipDependencyProperties) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const dependency: Dependency & { target: string; source: string } =
    edge.data();

  return (
    <div ref={(el) => setAnchor(el)}>
      {anchor && (
        <GraphTooltip element={edge}>
          <div className="bg-background grid gap-3 rounded-md p-3">
            <Heading as="p" size="md" className="leading-none">
              <span>{dependency.source}</span>
              <ArrowRight className="mx-1 inline-block h-4 w-4" />
              <span>{dependency.target}</span>
            </Heading>
            <div className="flex flex-nowrap items-center gap-2">
              <div
                className={cn('h-2 w-2 rounded-full', {
                  'bg-green-600': dependency.type === DependencyType.PRODUCTION,
                  'bg-blue-600': dependency.type === DependencyType.DEVELOPMENT,
                  'bg-purple-600': dependency.type === DependencyType.PEER,
                })}
              />
              <Text className="text-foreground font-medium leading-none">
                {TextByType[dependency.type]}
              </Text>
            </div>

            <Label>Version range</Label>
            <p>
              {dependency.version ? (
                <span className="font-mono">{dependency.version}</span>
              ) : (
                'No version'
              )}
            </p>
          </div>
        </GraphTooltip>
      )}
    </div>
  );
}
