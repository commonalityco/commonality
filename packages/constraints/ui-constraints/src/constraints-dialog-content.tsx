// create a ConstraintsDialog component
import { GradientFade } from '@commonalityco/ui-core';
import {
  Button,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  ScrollArea,
  Separator,
} from '@commonalityco/ui-design-system';
import { useMemo, useState } from 'react';
import { ConstraintResults } from './constraint-results';
import { ConstraintResult } from '@commonalityco/types';

export function ConstraintsDialogContent({
  results,
  onClose = () => {},
}: {
  results: ConstraintResult[];
  onClose?: () => void;
}) {
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
    <>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>All constraints</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div>
          <Input
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

        <Separator className="my-2" />
        <DialogFooter>
          <Button variant="outline" className="w-full" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </>
  );
}
