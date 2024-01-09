'use client';
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  ScrollArea,
} from '@commonalityco/ui-design-system';
import { ConformanceResult } from '@commonalityco/utils-conformance';
import { ComponentProps } from 'react';
import { ConformanceResults } from './conformance-results-list';
import { GradientFade } from '@commonalityco/ui-core';

export function AllChecksDialog({
  results,
  ...props
}: ComponentProps<typeof Dialog> & {
  results: Omit<ConformanceResult, 'fix'>[];
}) {
  return (
    <Dialog {...props}>
      <DialogTrigger asChild>
        <Button variant="secondary">View all checks</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>All checks</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[400px] py-2 relative">
          <ConformanceResults results={results} />
          <GradientFade placement="bottom" />
        </ScrollArea>
        <DialogFooter>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => props?.onOpenChange?.(false)}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
