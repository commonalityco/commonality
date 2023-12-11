import {
  Badge,
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@commonalityco/ui-design-system';
import { ChevronDown } from 'lucide-react';
import React from 'react';
import { ConformanceResults, StatusCount } from '.';
import { ConformanceResult } from '@commonalityco/types';
import { Status } from '@commonalityco/utils-core';

export function ConformanceHeader({
  results,
  children,
  shownCount,
  totalCount,
}: {
  results: ConformanceResult[];
  totalCount: number;
  shownCount: number;
  children?: React.ReactNode;
}) {
  const failCount = results.filter(
    (result) => result.status === Status.Fail,
  ).length;
  const warnCount = results.filter(
    (result) => result.status === Status.Warn,
  ).length;
  const passCount = results.filter(
    (result) => result.status === Status.Pass,
  ).length;

  return (
    <div className="flex justify-between flex-nowrap items-center">
      <div className="flex gap-4 items-center">
        <h1 className="font-medium text-2xl leading-none">Checks</h1>
        <Badge
          variant="secondary"
          className="text-muted-foreground"
        >{`${shownCount} of ${totalCount} packages`}</Badge>
      </div>
      <div className="flex gap-4 flex-nowrap">
        <StatusCount
          failCount={failCount}
          warnCount={warnCount}
          passCount={passCount}
        />
        <div className="flex gap-2 flex-nowrap">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="secondary" className="flex gap-2">
                View all checks
                <ChevronDown className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              className="max-h-[500px] w-[500px] overflow-auto"
            >
              <ConformanceResults results={results} />
            </PopoverContent>
          </Popover>
          {children}
        </div>
      </div>
    </div>
  );
}
