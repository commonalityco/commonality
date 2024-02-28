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
import { CornerDownRight } from 'lucide-react';
import { ComponentProps } from 'react';

const TextByType = {
  [DependencyType.PRODUCTION]: 'production',
  [DependencyType.DEVELOPMENT]: 'development',
  [DependencyType.PEER]: 'peer',
};

export function DependencyDialog({
  dependencies,
  ...props
}: ComponentProps<typeof Dialog> & {
  dependencies: Dependency[];
}) {
  return (
    <Dialog {...props}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <div className="grid gap-1">
              <p className="truncate leading-6">{dependencies[0]?.source}</p>
              <div className="flex flex-nowrap items-center space-x-2 overflow-hidden">
                <CornerDownRight className="h-4 w-4 min-w-0 shrink-0" />
                <p className="truncate min-w-0 leading-6">
                  {dependencies[0]?.target}
                </p>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[450px]">
          <div className="flex flex-col gap-4 py-2">
            {dependencies.map((dependency) => {
              const key = `${dependency.source}-${dependency.target}-${dependency.type}`;

              return (
                <div key={key} className="grid gap-4">
                  <div>
                    <Label className="block mb-2">Type</Label>

                    <p className="font-mono flex items-center gap-2">
                      <span
                        className={cn('inline-block w-2 h-2 rounded-full', {
                          'bg-sky-600':
                            dependency.type === DependencyType.DEVELOPMENT,
                          'bg-purple-600':
                            dependency.type === DependencyType.PEER,
                          'bg-emerald-600':
                            dependency.type === DependencyType.PRODUCTION,
                        })}
                      />
                      <span>{TextByType[dependency.type]}</span>
                    </p>
                  </div>
                  <div>
                    <Label className="block mb-2">Version</Label>
                    <p className="font-mono">{dependency.version}</p>
                  </div>
                </div>
              );
            })}
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
