import { ConstraintResult } from '@commonalityco/types';
import {
  Badge,
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  cn,
} from '@commonalityco/ui-design-system';
import { Check, ChevronDown, X } from 'lucide-react';
import { ConstraintResults } from '..';

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
  const failCount = results.filter((result) => !result.isValid).length;
  const passCount = results.filter((result) => result.isValid).length;

  const resultsByPackageName: Record<string, ConstraintResult[]> = {};
  for (const result of results) {
    const packageName = result.dependencyPath[0].source;
    const existingResultsForPackage = resultsByPackageName[packageName];

    if (existingResultsForPackage) {
      existingResultsForPackage.push(result);
    } else {
      resultsByPackageName[packageName] = [result];
    }
  }

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
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="secondary" className="flex gap-2">
              View all constraints
              <ChevronDown className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            align="end"
            className="max-h-[500px] w-[500px] overflow-auto"
          >
            <ConstraintResults results={results} />
          </PopoverContent>
        </Popover>
        {children}
      </div>
    </div>
  );
}

export default GraphHeader;
