import { ConstraintResult } from '@commonalityco/types';
import { cn } from '@commonalityco/ui-design-system';
import { Check, X } from 'lucide-react';
import { useState } from 'react';
import { AllConstraintsDialog } from './all-constraints-dialog';

function GraphHeader({
  totalCount,
  shownCount,
  results,
  children,
}: {
  totalCount: number;
  shownCount: number;
  results: ConstraintResult[];
  children?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const failCount = results.filter((result) => !result.isValid).length;
  const passCount = results.filter((result) => result.isValid).length;

  return (
    <div className="flex px-6 py-4 justify-between">
      <div className="flex gap-4 items-center">
        <h1 className="font-medium text-2xl leading-none">Constraints</h1>
        {totalCount > 0 ? (
          <p className="text-muted-foreground text-xs animate-in fade-in">{`${shownCount} of ${totalCount} packages`}</p>
        ) : undefined}
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
            <X className="h-4 w-4" />
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
            <Check className="h-4 w-4" />
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

export default GraphHeader;
