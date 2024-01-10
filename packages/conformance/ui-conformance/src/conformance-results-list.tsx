import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Badge,
  Label,
  cn,
} from '@commonalityco/ui-design-system';
import { PackageType, Status, formatTagName } from '@commonalityco/utils-core';
import { Fragment, useMemo } from 'react';
import { ConformanceResult } from '@commonalityco/utils-conformance';
import { ConformanceOnboardingCard } from './conformance-onboarding-card';
import { GradientFade } from '@commonalityco/ui-core';
import { getIconForPackage } from '@commonalityco/utils-core';

export function CheckTitle({ result }: { result: ConformanceResult }) {
  const getStatusText = () => {
    switch (result.status) {
      case Status.Pass: {
        return (
          <span className="text-success font-mono font-medium items-center flex flex-nowrap gap-2">
            pass
          </span>
        );
      }
      case Status.Warn: {
        return (
          <span className="text-warning font-mono font-medium items-center flex flex-nowrap gap-2">
            warn
          </span>
        );
      }
      case Status.Fail: {
        return (
          <span className="text-destructive font-mono font-medium items-center flex flex-nowrap gap-2">
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
        <div className="text-left grow shrink basis-auto min-w-0 max-w-full break-words">
          {result.message.title}
        </div>
      </div>
    </div>
  );
}

export function CheckContent({ result }: { result: ConformanceResult }) {
  return (
    <div className="pl-[50px] space-y-4">
      <div>
        <Label className="block text-xs mb-1" id="applied-to">
          Applied to
        </Label>
        <Badge variant="outline" aria-labelledby="applied-to">
          {formatTagName(result.filter)}
        </Badge>
      </div>

      {result.message.filePath ? (
        <div>
          <Label className="block text-xs mb-1" id="filepath">
            Filepath
          </Label>
          <p
            className="text-muted-foreground font-mono text-xs truncate block"
            aria-labelledby="filepath"
          >
            {result.message.filePath}
          </p>
        </div>
      ) : undefined}
      {result.message.suggestion ? (
        <div>
          <Label className="block text-xs mb-1" id="suggestion">
            Suggestion
          </Label>
          <div
            className="bg-muted border border-border rounded-md overflow-auto"
            aria-labelledby="suggestion"
          >
            <pre className="px-2 py-1 max-w-full">
              <code className="text-muted-foreground font-mono text-xs">
                {result.message.suggestion}
              </code>
            </pre>
          </div>
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
    <div className="flex gap-4 shrink-0">
      {failCount > 0 ? (
        <span
          className="shrink-0 flex flex-nowrap items-center gap-1 font-medium text-destructive"
          aria-labelledby="fail-count"
        >
          <span id="fail-count" className="sr-only">
            Fail count
          </span>
          <span>{failCount}</span>
          failed
        </span>
      ) : undefined}
      {warnCount > 0 ? (
        <span
          className="shrink-0 flex flex-nowrap items-center gap-1 font-medium text-warning"
          aria-labelledby="warn-count"
        >
          <span id="warn-count" className="sr-only">
            Warning count
          </span>
          <span>{warnCount}</span>
          warnings
        </span>
      ) : undefined}
      {passCount > 0 ? (
        <span
          className="shrink-0 flex flex-nowrap items-center gap-1 font-medium text-success"
          aria-labelledby="pass-count"
        >
          <span id="pass-count" className="sr-only">
            Pass count
          </span>
          <span>{passCount}</span>
          passed
        </span>
      ) : undefined}
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
    <div className="grid gap-4">
      {Object.entries(resultsByPackageName).map(
        ([packageName, resultsForPackage]) => {
          if (resultsForPackage.length === 0) {
            return;
          }

          const PackageIcon = getIconForPackage(
            resultsForPackage[0].package.type || PackageType.NODE,
          );

          return (
            <div key={packageName} className="grid relative">
              <div className="sticky top-0 z-10">
                <div className="flex gap-2 flex-nowrap bg-background items-center">
                  <PackageIcon className="shrink-0" />
                  <p className="font-medium text-base truncate min-w-0">
                    {packageName}
                  </p>
                </div>
                <GradientFade placement="top" className="h-2" />
              </div>

              <Accordion type="multiple" className="w-full overflow-hidden">
                {resultsForPackage.map((result, index) => {
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
            </div>
          );
        },
      )}
    </div>
  );
}

export default ConformanceResults;
