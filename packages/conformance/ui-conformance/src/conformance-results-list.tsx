import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Badge,
  cn,
} from '@commonalityco/ui-design-system';
import { Status, formatTagName } from '@commonalityco/utils-core';
import { AlertTriangle, Check, X } from 'lucide-react';
import { Fragment, useMemo } from 'react';
import {
  getStatusForResults,
  ConformanceResult,
} from '@commonalityco/utils-conformance';
import { ConformanceOnboardingCard } from './conformance-onboarding-card';

export function CheckTitle({ result }: { result: ConformanceResult }) {
  const getStatusText = () => {
    switch (result.status) {
      case Status.Pass: {
        return (
          <span className="text-success font-mono font-medium items-center flex flex-nowrap gap-2">
            <Check className="h-4 w-4" />
            pass
          </span>
        );
      }
      case Status.Warn: {
        return (
          <span className="text-warning font-mono font-medium items-center flex flex-nowrap gap-2">
            <AlertTriangle className="h-4 w-4" />
            warn
          </span>
        );
      }
      case Status.Fail: {
        return (
          <span className="text-destructive font-mono font-medium items-center flex flex-nowrap gap-2">
            <X className="h-4 w-4" />
            fail
          </span>
        );
      }
    }
  };

  return (
    <div className="flex items-center overflow-hidden w-full">
      <div className="grid gap-4 grid-cols-[minmax(0,max-content)_1fr] text-left items-start">
        <div className="flex gap-1 items-center">{getStatusText()}</div>
        <div className="text-left grow shrink basis-auto min-w-0 max-w-full">
          {result.message.title}
        </div>
      </div>
    </div>
  );
}

export function CheckContent({ result }: { result: ConformanceResult }) {
  if (!result.message.filePath && !result.message.suggestion) {
    return (
      <p className="pl-[74px] text-muted-foreground text-xs">
        No additional context
      </p>
    );
  }

  return (
    <div className="pl-[74px] space-y-1">
      {result.message.filePath ? (
        <p className="text-muted-foreground font-mono text-xs truncate block">
          {result.message.filePath}
        </p>
      ) : undefined}
      {result.message.suggestion ? (
        <div className="bg-muted border border-border rounded-md overflow-auto">
          <pre className="px-2 py-1 max-w-full">
            <code className="text-muted-foreground font-mono text-xs">
              {result.message.suggestion}
            </code>
          </pre>
        </div>
      ) : undefined}
    </div>
  );
}

export function StatusCount({
  failCount,
  warnCount,
  passCount,
}: {
  failCount: number;
  warnCount: number;
  passCount: number;
}) {
  return (
    <div className="font-mono flex gap-4 shrink-0">
      <span
        className={cn('shrink-0 flex flex-nowrap items-center gap-1', {
          'text-destructive': failCount > 0,
          'text-muted-foreground': failCount === 0,
        })}
        aria-labelledby="fail-count"
      >
        <span id="fail-count" className="sr-only">
          Fail count
        </span>
        <X className="h-4 w-4" />
        {failCount}
      </span>
      <span
        className={cn('shrink-0 flex flex-nowrap items-center gap-1', {
          'text-warning': warnCount > 0,
          'text-muted-foreground': warnCount === 0,
        })}
        aria-labelledby="warn-count"
      >
        <span id="warn-count" className="sr-only">
          Warning count
        </span>
        <AlertTriangle className="h-4 w-4" />
        {warnCount}
      </span>
      <span
        className={cn('shrink-0 flex flex-nowrap items-center gap-1', {
          'text-success': passCount > 0,
          'text-muted-foreground': passCount === 0,
        })}
        aria-labelledby="pass-count"
      >
        <span id="pass-count" className="sr-only">
          Pass count
        </span>
        <Check className="h-4 w-4" />
        {passCount}
      </span>
    </div>
  );
}

export function FilterTitle({
  status,
  filter,
}: {
  status: Status;
  filter: string;
}) {
  return (
    <div className="flex items-center gap-1">
      <Badge
        className={cn({
          'bg-destructive': status === Status.Fail,
          'bg-success': status === Status.Pass,
          'bg-warning': status === Status.Warn,
        })}
      >
        {formatTagName(filter)}
      </Badge>
    </div>
  );
}

export function ConformanceResults({
  results,
}: {
  results: ConformanceResult[];
}) {
  if (!results || results.length === 0) {
    return <ConformanceOnboardingCard />;
  }

  const resultsByPackageName = useMemo(() => {
    const resultsMap: Record<string, ConformanceResult[]> = {};
    for (const result of results) {
      const packageName = result.package.name;
      const existingResultsForPackage = resultsMap[packageName];

      if (existingResultsForPackage) {
        existingResultsForPackage.push(result);
      } else {
        resultsMap[packageName] = [result];
      }
    }
    return resultsMap;
  }, [results]);

  return (
    <div className="grid gap-6 overflow-hidden">
      {Object.entries(resultsByPackageName).map(
        ([packageName, resultsForPackage]) => {
          if (resultsForPackage.length === 0) {
            return <p>No checks for package</p>;
          }

          const resultsForPackageByFilter: Record<string, ConformanceResult[]> =
            {};
          for (const result of resultsForPackage) {
            const filter = result.filter;
            const existingResultsForFilter = resultsForPackageByFilter[filter];

            if (existingResultsForFilter) {
              existingResultsForFilter.push(result);
            } else {
              resultsForPackageByFilter[filter] = [result];
            }
          }

          return (
            <div key={packageName} className="grid gap-2">
              <p className="font-medium text-base">{packageName}</p>
              <div className="grid gap-4">
                {Object.entries(resultsForPackageByFilter).map(
                  ([filter, resultsForFilter]) => {
                    const status = getStatusForResults(resultsForFilter);

                    return (
                      <Accordion
                        type="multiple"
                        key={filter}
                        className="w-full overflow-hidden"
                      >
                        <FilterTitle filter={filter} status={status} />
                        {resultsForFilter.map((result, index) => {
                          const value = `${result.name}-${index}`;

                          return (
                            <Fragment key={value}>
                              <AccordionItem value={value}>
                                <AccordionTrigger>
                                  <CheckTitle result={result} />
                                </AccordionTrigger>
                                <AccordionContent>
                                  <CheckContent result={result} />
                                </AccordionContent>
                              </AccordionItem>
                            </Fragment>
                          );
                        })}
                      </Accordion>
                    );
                  },
                )}
              </div>
            </div>
          );
        },
      )}
    </div>
  );
}

export default ConformanceResults;
