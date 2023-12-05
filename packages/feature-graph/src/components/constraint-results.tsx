import { ConstraintResult } from '@commonalityco/types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Badge,
  cn,
} from '@commonalityco/ui-design-system';
import { DependencyType, formatTagName } from '@commonalityco/utils-core';
import { ArrowRight, CornerDownRight, Filter, Tag } from 'lucide-react';
import { Fragment, useMemo } from 'react';

const dependencyTextByType = {
  [DependencyType.PRODUCTION]: 'prod',
  [DependencyType.DEVELOPMENT]: 'dev',
  [DependencyType.PEER]: 'peer',
};

export function ConstraintTitle({ result }: { result: ConstraintResult }) {
  return (
    <AccordionTrigger className="flex items-center overflow-hidden w-full">
      <div className="flex gap-4 items-start">
        <div className="flex gap-1 items-center">
          <CornerDownRight
            className={cn('h-4 w-4 leading-none', {
              'text-destructive': !result.isValid,
              'text-success': result.isValid,
            })}
          />

          {result.isValid ? (
            <span className="text-success font-medium leading-none font-mono">
              pass
            </span>
          ) : (
            <span className="text-destructive font-medium leading-none font-mono">
              fail
            </span>
          )}
        </div>
        <div className="flex gap-2 flex-wrap items-start">
          {result.dependencyPath.map((dependency, index, original) => {
            const isLast = index === original.length - 1;

            return (
              <Fragment key={`${dependency.target}-${dependency.type}`}>
                <div className="flex gap-1 items-center">
                  <span className="shrink-0 leading-none font-medium">
                    {dependency.target}
                  </span>
                  <span className="text-muted-foreground leading-none leading-none">
                    {dependencyTextByType[dependency.type]}
                  </span>
                </div>
                {isLast ? undefined : (
                  <ArrowRight className="w-4 h-4 leading-none -translate-y-px" />
                )}
              </Fragment>
            );
          })}
        </div>
      </div>
    </AccordionTrigger>
  );
}

export function ConstraintContent({ result }: { result: ConstraintResult }) {
  return (
    <div className="flex gap-1 flex-wrap">
      <div>
        <div className="grid gap-3 grid-cols-[minmax(min-content,max-content)_1fr]">
          {'allow' in result.constraint ? (
            <>
              <p>Allowed:</p>
              <div className="flex gap-1">
                {result.constraint.allow === '*' ? (
                  <span className="text-success">All packages</span>
                ) : (
                  result.constraint.allow.map((tag) => {
                    const isInFoundTags = result.foundTags?.includes(tag);
                    return (
                      <Badge
                        variant="outline"
                        key={tag}
                        className={cn({
                          'border-success text-success': isInFoundTags,
                        })}
                      >
                        {formatTagName(tag)}
                      </Badge>
                    );
                  })
                )}
              </div>
            </>
          ) : undefined}
          {'disallow' in result.constraint ? (
            <>
              <p>Disallowed:</p>
              <div className="flex gap-1">
                {result.constraint.disallow === '*' ? (
                  <span className="text-destructive">All packages</span>
                ) : (
                  result.constraint.disallow.map((tag) => {
                    const isInFoundTags = result.foundTags?.includes(tag);
                    return (
                      <Badge
                        variant="outline"
                        key={tag}
                        className={cn({
                          'border-destructive text-destructive': isInFoundTags,
                        })}
                      >
                        {formatTagName(tag)}
                      </Badge>
                    );
                  })
                )}
              </div>
            </>
          ) : undefined}

          <p>Found:</p>
          <div className="flex gap-1">
            {result.foundTags ? (
              result.foundTags.map((tag) => {
                const isAllowAll =
                  'allow' in result.constraint &&
                  typeof result.constraint.allow === 'string' &&
                  result.constraint.allow === '*';
                const isDisallowAll =
                  'disallow' in result.constraint &&
                  typeof result.constraint.disallow === 'string' &&
                  result.constraint.disallow === '*';
                const isAllowed =
                  'allow' in result.constraint &&
                  Array.isArray(result.constraint.allow) &&
                  result.constraint.allow.includes(tag);
                const isDisallowed =
                  'disallow' in result.constraint &&
                  Array.isArray(result.constraint.disallow) &&
                  result.constraint.disallow.includes(tag);

                return (
                  <Badge
                    variant="outline"
                    key={tag}
                    className={cn({
                      '!border-destructive !text-destructive':
                        isDisallowAll || isDisallowed,
                      'border-success text-success': isAllowAll || isAllowed,
                    })}
                  >
                    {formatTagName(tag)}
                  </Badge>
                );
              })
            ) : (
              <span className="text-muted-foreground">No tags found</span>
            )}
          </div>
        </div>
      </div>
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

export function ConstraintResults({
  results,
}: {
  results: ConstraintResult[];
}) {
  if (!results || results.length === 0) {
    return <p className="text-muted-foreground">No constraints found</p>;
  }

  const resultsByPackageName = useMemo(() => {
    const resultsMap: Record<string, ConstraintResult[]> = {};
    for (const result of results) {
      const packageName = result.dependencyPath[0].source;
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

          const resultsForPackageByFilter: Record<string, ConstraintResult[]> =
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
                      (result) => result.isValid,
                    );

                    return (
                      <Accordion type="multiple" key={filter}>
                        <FilterTitle filter={filter} isValid={isValid} />
                        {resultsForFilter.map((result) => {
                          const value = result.dependencyPath
                            .map((dep) => `${dep.target}-${dep.type}}`)
                            .join('-');

                          return (
                            <Fragment key={value}>
                              <AccordionItem value={value}>
                                <ConstraintTitle result={result} />
                                <AccordionContent className="pl-[70px]">
                                  <ConstraintContent result={result} />
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

export default ConstraintResults;
