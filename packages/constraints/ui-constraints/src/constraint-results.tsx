import { ConstraintResult } from '@commonalityco/types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Badge,
  Button,
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  cn,
} from '@commonalityco/ui-design-system';
import { DependencyType, formatTagName } from '@commonalityco/utils-core';
import { ArrowRight, Check, ExternalLink, Network, X } from 'lucide-react';
import { useMemo } from 'react';
import uniqBy from 'lodash/uniqBy';
import isEqual from 'lodash/isEqual';
import { GradientFade } from '@commonalityco/ui-core';

const dependencyTextByType = {
  [DependencyType.PRODUCTION]: 'prod',
  [DependencyType.DEVELOPMENT]: 'dev',
  [DependencyType.PEER]: 'peer',
};

function TagsContainer({ children }: { children: React.ReactNode }) {
  return <dd className="flex flex-wrap gap-1 overflow-hidden">{children}</dd>;
}

export function ConstraintOnboardingCard() {
  return (
    <Card variant="secondary">
      <CardHeader>
        <div className="bg-background mb-3 flex h-10 w-10 items-center justify-center rounded-full border">
          <div className="bg-secondary rounded-full p-1.5">
            <Network className="h-5 w-5" />
          </div>
        </div>

        <CardTitle>Organize your dependency graph</CardTitle>
        <CardDescription>
          Prevent endless dependency debugging by limiting the which packages
          can depend on each other.
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Button asChild variant="outline" size="sm">
          <a
            href="https://commonality.co/docs/checks"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn more
            <ExternalLink className="ml-1 h-3 w-3 -translate-y-px" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}

export function ConstraintTitle({ result }: { result: ConstraintResult }) {
  return (
    <AccordionTrigger className="flex items-center overflow-hidden w-full relative">
      <div className="flex gap-4 items-start">
        <div className="flex gap-1 items-center">
          {result.isValid ? (
            <span className="text-success font-medium font-mono">pass</span>
          ) : (
            <span className="text-destructive font-medium font-mono">fail</span>
          )}
        </div>
        <div className="flex gap-2 items-center flex-wrap">
          {result.dependencyPath.map((dependency, index) => {
            return (
              <div
                className="flex gap-2 items-center flex-nowrap"
                key={`${dependency.target}-${dependency.type}`}
              >
                {index === 0 ? undefined : (
                  <ArrowRight className="w-4 h-4 translate-y-px min-w-0 shrink-0" />
                )}
                <div className="grid auto-cols-auto grid-flow-col	gap-1 items-center overflow-hidden">
                  <span className="font-medium shrink truncate min-w-0">
                    {dependency.target}
                  </span>
                  <span className="text-muted-foreground min-w-0">
                    {dependencyTextByType[dependency.type]}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AccordionTrigger>
  );
}

export function ConstraintContent({ result }: { result: ConstraintResult }) {
  return (
    <div className="flex gap-4 flex-nowrap">
      <div className="w-[35px] text-right shrink-0">
        {result.isValid ? (
          <Check className="w-4 h-4 inline-block text-success" />
        ) : (
          <X className="w-4 h-4 inline-block text-destructive" />
        )}
      </div>

      <div className="grid gap-3 grid-cols-[minmax(min-content,max-content)_1fr]">
        <dt className="shrink-0 whitespace-nowrap">Applied to:</dt>

        <TagsContainer>
          <Badge variant="outline" className={cn('truncate inline-block')}>
            {formatTagName(result.filter)}
          </Badge>
        </TagsContainer>

        {'allow' in result.constraint ? (
          <>
            <dt className="shrink-0 whitespace-nowrap">Allowed:</dt>
            <TagsContainer>
              {result.constraint.allow === '*' ? (
                <span className="text-success">All packages</span>
              ) : (
                result.constraint.allow.map((tag) => {
                  const isInFoundTags = result.foundTags?.includes(tag);
                  return (
                    <Badge
                      variant="outline"
                      key={tag}
                      className={cn('truncate inline-block', {
                        'border-success text-success': isInFoundTags,
                      })}
                    >
                      {formatTagName(tag)}
                    </Badge>
                  );
                })
              )}
            </TagsContainer>
          </>
        ) : undefined}
        {'disallow' in result.constraint ? (
          <>
            <dt className="shrink-0 whitespace-nowrap">Disallowed:</dt>
            <TagsContainer>
              {result.constraint.disallow === '*' ? (
                <span className="text-destructive">All packages</span>
              ) : (
                result.constraint.disallow.map((tag) => {
                  const isInFoundTags = result.foundTags?.includes(tag);
                  return (
                    <Badge
                      variant="outline"
                      key={tag}
                      className={cn('truncate inline-block', {
                        'border-destructive text-destructive': isInFoundTags,
                      })}
                    >
                      {formatTagName(tag)}
                    </Badge>
                  );
                })
              )}
            </TagsContainer>
          </>
        ) : undefined}

        <p className="shrink-0 whitespace-nowrap">Found:</p>
        <TagsContainer>
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
                  className={cn('inline-block min-w-0', {
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
        </TagsContainer>
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
    return <ConstraintOnboardingCard />;
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
    <div className="grid gap-6 w-full">
      {Object.entries(resultsByPackageName).map(
        ([packageName, resultsForPackage]) => {
          if (resultsForPackage.length === 0) {
            return <p>No results</p>;
          }

          const resultsUniqueByDependencyPath = uniqBy(
            resultsForPackage,
            (result) => JSON.stringify(result.dependencyPath),
          );

          return (
            <div key={packageName} className="grid relative">
              <div className="sticky top-0 z-10">
                <p className="font-medium text-base bg-background">
                  {packageName}
                </p>
                <GradientFade placement="top" className="h-2" />
              </div>
              <div className="grid">
                {resultsUniqueByDependencyPath.map(
                  (resultForDependencyPath) => {
                    const value = JSON.stringify(
                      resultForDependencyPath.dependencyPath,
                    );
                    const allResultsForDependencyPath =
                      resultsForPackage.filter((result) =>
                        isEqual(
                          result.dependencyPath,
                          resultForDependencyPath.dependencyPath,
                        ),
                      );

                    const resultsByFilter: Record<string, ConstraintResult[]> =
                      {};
                    for (const result of allResultsForDependencyPath) {
                      const filter = result.filter;
                      if (!resultsByFilter[filter]) {
                        resultsByFilter[filter] = [];
                      }
                      resultsByFilter[filter].push(result);
                    }

                    return (
                      <Accordion type="multiple" key={value}>
                        <AccordionItem value={value}>
                          <ConstraintTitle result={resultForDependencyPath} />
                          <AccordionContent>
                            <div className="grid gap-8">
                              {Object.entries(resultsByFilter).map(
                                ([filter, results]) => {
                                  return (
                                    <div key={filter} className="grid gap-2">
                                      {results.map((result) => (
                                        <ConstraintContent
                                          result={result}
                                          key={JSON.stringify(
                                            result.dependencyPath,
                                          )}
                                        />
                                      ))}
                                    </div>
                                  );
                                },
                              )}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
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
