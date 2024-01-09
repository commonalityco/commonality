'use client';
import { Badge } from '@commonalityco/ui-design-system';
import React, { useState } from 'react';
import { StatusCount } from './conformance-results-list';
import { ConformanceResult } from '@commonalityco/utils-conformance';
import { Status } from '@commonalityco/utils-core';
import { AllChecksDialog } from './all-checks-dialog';

export function ConformanceHeader({
  results,
  children,
  shownCount,
  totalCount,
}: {
  results: Omit<ConformanceResult, 'fix'>[];
  totalCount: number;
  shownCount: number;
  children?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
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
          <AllChecksDialog
            results={results}
            open={open}
            onOpenChange={setOpen}
          />
          {children}
        </div>
      </div>
    </div>
  );
}
