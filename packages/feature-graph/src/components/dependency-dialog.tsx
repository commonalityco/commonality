'use client';
import { Dependency } from '@commonalityco/types';
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Label,
  ScrollArea,
  cn,
} from '@commonalityco/ui-design-system';
import { DependencyType } from '@commonalityco/utils-core';
import { CornerDownRight, Network } from 'lucide-react';
import { ComponentProps } from 'react';

const TextByType = {
  [DependencyType.PRODUCTION]: 'production',
  [DependencyType.DEVELOPMENT]: 'development',
  [DependencyType.PEER]: 'peer',
};

export function DependencyDialog({
  dependency,
  ...props
}: ComponentProps<typeof Dialog> & {
  dependency: Dependency;
}) {
  return (
    <Dialog {...props}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <div className="flex flex-nowrap items-center gap-4">
              <div
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-md border',
                  {
                    'border-purple-700 bg-purple-100 dark:border-purple-600 dark:bg-purple-900':
                      dependency.type === DependencyType.PEER,
                    'border-sky-700 bg-sky-100 dark:border-sky-600 dark:bg-sky-900':
                      dependency.type === DependencyType.DEVELOPMENT,
                    'border-emerald-700 bg-emerald-100 dark:border-emerald-600 dark:bg-emerald-900':
                      dependency.type === DependencyType.PRODUCTION,
                  },
                )}
              >
                <Network
                  className={cn('h-4 w-4', {
                    'text-purple-700 dark:text-purple-100':
                      dependency.type === DependencyType.PEER,
                    'text-sky-700 dark:text-sky-100':
                      dependency.type === DependencyType.DEVELOPMENT,
                    'text-emerald-700 dark:text-emerald-100':
                      dependency.type === DependencyType.PRODUCTION,
                  })}
                />
              </div>
              <span>Dependency</span>
            </div>
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[450px]">
          <div className="flex flex-col gap-4 pb-2">
            <div>
              <Label className="mb-2 block">Type</Label>
              <div
                className={cn('inline-block rounded-full border px-2 py-0.5', {
                  'border-purple-700 bg-purple-100 dark:border-purple-600 dark:bg-purple-900':
                    dependency.type === DependencyType.PEER,
                  'border-sky-700 bg-sky-100 dark:border-sky-600 dark:bg-sky-900':
                    dependency.type === DependencyType.DEVELOPMENT,
                  'border-emerald-700 bg-emerald-100 dark:border-emerald-600 dark:bg-emerald-900':
                    dependency.type === DependencyType.PRODUCTION,
                })}
              >
                <p className="flex items-center gap-2 font-mono text-xs font-medium">
                  <span>{TextByType[dependency.type]}</span>
                </p>
              </div>
            </div>
            <div>
              <Label>Source</Label>
              <p>{dependency.source}</p>
            </div>
            <div>
              <Label>Target</Label>
              <p>{dependency.target}</p>
            </div>

            <div>
              <Label>Version</Label>
              <p>{dependency.version}</p>
            </div>
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button
            className="w-full"
            onClick={() => props.onOpenChange?.(false)}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
