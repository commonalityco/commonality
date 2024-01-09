// create a ConstraintsDialog component
import { GradientFade } from '@commonalityco/ui-core';
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
import { useMemo, useState, ComponentProps } from 'react';
import { ConstraintResults } from './constraint-results';
import { ConstraintResult } from '@commonalityco/types';

export function AllConstraintsDialog({
  results,
  ...props
}: {
  results: ConstraintResult[];
} & ComponentProps<typeof Dialog>) {
  const [search, setSearch] = useState('');

  const filteredResults = useMemo(() => {
    if (search === '') {
      return results;
    }

    return results.filter((result) => {
      return result.dependencyPath[0].source.includes(search);
    });
  }, [results, search]);

  const hasResults = filteredResults.length > 0;

  return (
    <Dialog {...props}>
      <DialogTrigger asChild>
        <Button variant="secondary">View all constraints</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>All constraints</DialogTitle>
        </DialogHeader>
        <div>
          <Input
            aria-label="Search packages"
            className="mb-3"
            placeholder="Search packages"
            onChange={(event) => setSearch(event.target.value)}
          />
          {hasResults ? (
            <p className="text-xs text-muted-foreground leading-none">{`${filteredResults.length} constraints`}</p>
          ) : undefined}
        </div>
        {hasResults || (!hasResults && !search) ? (
          <ScrollArea className="max-h-[450px]">
            <ConstraintResults results={filteredResults} />
            {hasResults ? <GradientFade placement="bottom" /> : undefined}
          </ScrollArea>
        ) : undefined}
        {!hasResults && search ? (
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
