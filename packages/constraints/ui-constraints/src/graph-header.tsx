import { ConstraintResult } from '@commonalityco/types';
import {
  Badge,
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  cn,
  ScrollArea,
} from '@commonalityco/ui-design-system';
import { Check, ChevronDown, X } from 'lucide-react';
import { ConstraintResults } from '.';
import { GradientFade } from '@commonalityco/ui-core';
import { useState } from 'react';

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
        <Badge
          variant="outline"
          className="text-muted-foreground"
        >{`${shownCount} of ${totalCount} packages`}</Badge>
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
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="secondary" className="flex gap-2">
              View all constraints
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>All constraints</DialogTitle>
            </DialogHeader>
            <ScrollArea className="max-h-[500px] pt-2">
              <ConstraintResults results={results} />
              <GradientFade placement="bottom" />
            </ScrollArea>
            <div>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setOpen(false)}
              >
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        {children}
      </div>
    </div>
  );
}

export default GraphHeader;
