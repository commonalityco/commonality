'use client';
import { ConstraintResult } from '@commonalityco/types';
import { cn } from '@commonalityco/ui-design-system';
import { useState } from 'react';
import { AllConstraintsDialog } from './all-constraints-dialog';

export function GraphHeader({
  results,
  children,
}: {
  results: ConstraintResult[];
  children?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const failCount = results.filter((result) => !result.isValid).length;
  const passCount = results.filter((result) => result.isValid).length;

  return (
    <div className="flex px-6 py-4 justify-between">
      <div className="flex gap-4 items-center">
        <h1 className="font-medium text-2xl leading-none">Graph</h1>
      </div>
      <div className="flex gap-2 flex-nowrap">
        <div className="flex gap-4 flex-nowrap mr-3">
          <p
            className={cn(
              'font-medium shrink-0 flex flex-nowrap items-center gap-1',
              {
                'text-destructive': failCount > 0,
                'text-muted-foreground': failCount === 0,
              },
            )}
          >
            {failCount}
            {` failed`}
          </p>
          <p
            className={cn(
              'font-medium shrink-0 flex flex-nowrap items-center gap-1',
              {
                'text-success': passCount > 0,
                'text-muted-foreground': passCount === 0,
              },
            )}
          >
            {passCount}
            {` passed`}
          </p>
        </div>

        <AllConstraintsDialog
          results={results}
          open={open}
          onOpenChange={setOpen}
        />

        {children}
      </div>
    </div>
  );
}
