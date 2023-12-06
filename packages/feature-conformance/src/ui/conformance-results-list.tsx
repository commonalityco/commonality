import { ConformanceResult } from '@commonalityco/types';
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
          <span className="text-yellow-500 font-mono font-medium items-center flex flex-nowrap gap-2">
            <AlertTriangle className="h-4 w-4" />
            warn
          </span>
        );
      }
      case Status.Fail: {
        return (
          <span className="text-destructive font-mono font-medium items-center flex flex-nowrap gap-2">
            <X className="h-4 w-4" />
            pass
          </span>
        );
      }
    }
  };

  return (
    <AccordionTrigger className="flex items-center overflow-hidden w-full">
      <div className="flex gap-4 items-start">
        <div className="flex gap-1 items-center">{getStatusText()}</div>
        <div className="flex gap-2 flex-wrap items-start">
          {result.message.title}
        </div>
      </div>
    </AccordionTrigger>
  );
}

export function CheckContent({ result }: { result: ConformanceResult }) {
  return (
    <div>
      {result.message.filepath ? (
        <p className="text-muted-foreground font-mono text-xs">
          {result.message.filepath}
        </p>
      ) : undefined}
      {result.message.context ? (
        <div className="bg-muted border border-border rounded-md overflow-auto">
          <pre className="px-1">
            <code className="text-muted-foreground font-mono text-xs">
              {result.message.context}
            </code>
          </pre>
        </div>
      ) : undefined}
    </div>
  );
}

export function FilterTitle({
  filter,
  isValid,
}: {
  filter: string;
  isValid: boolean;
}) {
  return (
    <div className="flex items-center gap-1">
      <Badge
        className={cn({
          'bg-destructive': !isValid,
          'bg-success': isValid,
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
    return <p className="text-muted-foreground">No constraints found</p>;
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
    <div className="grid gap-6">
      {Object.entries(resultsByPackageName).map(
        ([packageName, resultsForPackage]) => {
          if (resultsForPackage.length === 0) {
            return <p>No results</p>;
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
                    const isValid = resultsForFilter.every(
                      (result) => result.status === Status.Pass,
                    );

                    return (
                      <Accordion type="multiple" key={filter}>
                        <FilterTitle filter={filter} isValid={isValid} />
                        {resultsForFilter.map((result) => {
                          const value = `${result.name}-${result.package.name}`;

                          return (
                            <Fragment key={value}>
                              <AccordionItem value={value}>
                                <CheckTitle result={result} />
                                <AccordionContent className="pl-[70px]">
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
