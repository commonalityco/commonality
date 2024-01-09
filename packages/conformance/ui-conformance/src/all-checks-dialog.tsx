'use client';
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  ScrollArea,
} from '@commonalityco/ui-design-system';
import { ConformanceResult } from '@commonalityco/utils-conformance';
import { ComponentProps, useMemo, useState } from 'react';
import { ConformanceResults } from './conformance-results-list';
import { GradientFade } from '@commonalityco/ui-core';

export function AllChecksDialog({
  results,
  ...props
}: ComponentProps<typeof Dialog> & {
  results: Omit<ConformanceResult, 'fix'>[];
}) {
  const [search, setSearch] = useState('');

  const filteredResults = useMemo(() => {
    if (search === '') {
      return results;
    }

    return results.filter((result) => {
      return result.package.name.includes(search);
    });
  }, [results, search]);

  const hasFilteredResults = filteredResults.length > 0;

  return (
    <Dialog {...props}>
      <DialogTrigger asChild>
        <Button variant="secondary">View all checks</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>All checks</DialogTitle>
        </DialogHeader>
        {results.length > 0 ? (
          <div>
            <Input
              aria-label="Search packages"
              className="mb-3"
              placeholder="Search packages"
              onChange={(event) => setSearch(event.target.value)}
            />

            <p className="text-xs text-muted-foreground leading-none">{`${filteredResults.length} checks`}</p>
          </div>
        ) : undefined}
        {hasFilteredResults || (!hasFilteredResults && !search) ? (
          <ScrollArea className="max-h-[400px] py-2 relative">
            <ConformanceResults results={filteredResults} />
            <GradientFade placement="bottom" />
          </ScrollArea>
        ) : undefined}
        {!hasFilteredResults && search ? (
          <p className="text-center py-16">No packages match your filters</p>
        ) : undefined}
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
