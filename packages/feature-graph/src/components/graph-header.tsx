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
}: {
  totalCount: number;
  shownCount: number;
  results: ConstraintResult[];
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
          variant="secondary"
          className="text-muted-foreground"
        >{`${shownCount} of ${totalCount} packages`}</Badge>
      </div>
      <div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" className="flex gap-2">
              <span
                className={cn('shrink-0 flex flex-nowrap items-center gap-1', {
                  'text-destructive': failCount > 0,
                  'text-muted-foreground': failCount === 0,
                })}
              >
                <X className="h-4 w-4" />
                {failCount}
                {` failed`}
              </span>
              <span
                className={cn('shrink-0 flex flex-nowrap items-center gap-1', {
                  'text-success': passCount > 0,
                  'text-muted-foreground': passCount === 0,
                })}
              >
                <Check className="h-4 w-4" />
                {passCount}
                {` passed`}
              </span>
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
      </div>
    </div>
  );
}

export default GraphHeader;
