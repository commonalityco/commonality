import { ConstraintResult } from '@commonalityco/types';
import {
  Badge,
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  cn,
} from '@commonalityco/ui-design-system';
import { DependencyType, formatTagName } from '@commonalityco/utils-core';
import { Check, ChevronDown, CornerDownRight, X } from 'lucide-react';

const dependencyTextByType = {
  [DependencyType.PRODUCTION]: 'prod',
  [DependencyType.DEVELOPMENT]: 'dev',
  [DependencyType.PEER]: 'peer',
};

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
          variant="outline"
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
            {Object.keys(resultsByPackageName).map((packageName) => {
              const resultsForPackage = resultsByPackageName[packageName];

              if (!resultsForPackage) {
                // eslint-disable-next-line unicorn/no-null
                return null;
              }

              const resultsForPackageByFilter: Record<
                string,
                ConstraintResult[]
              > = {};
              for (const result of resultsForPackage) {
                const filter = result.filter;
                const existingResultsForFilter =
                  resultsForPackageByFilter[filter];

                if (existingResultsForFilter) {
                  existingResultsForFilter.push(result);
                } else {
                  resultsForPackageByFilter[filter] = [result];
                }
              }

              return (
                <div>
                  <p className="font-medium">{packageName}</p>
                  <div>
                    {Object.entries(resultsForPackageByFilter).map(
                      ([filter, resultsForFilter]) => {
                        return (
                          <div className="block">
                            <div>{formatTagName(filter)}</div>
                            {resultsForFilter.map((result) => {
                              return (
                                <div>
                                  <div className="flex gap-1 items-start">
                                    <div className="flex gap-1 items-center">
                                      <CornerDownRight
                                        className={cn('h-3 w-3', {
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
                                    <div className="flex gap-1 flex-wrap">
                                      {result.dependencyPath.map(
                                        (dependency) => {
                                          return (
                                            <div>
                                              <div
                                                key={`${dependency.target}-${dependency.type}`}
                                                className="flex gap-1 items-center"
                                              >
                                                <span className="shrink-0 leading-none font-medium">
                                                  {dependency.target}
                                                </span>
                                                <span className="text-muted-foreground leading-none">
                                                  {
                                                    dependencyTextByType[
                                                      dependency.type
                                                    ]
                                                  }
                                                </span>
                                              </div>
                                              <div className="grid grid-cols-2">
                                                {'allow' in
                                                result.constraint ? (
                                                  <>
                                                    <p>Allowed:</p>
                                                    <div>
                                                      {result.constraint
                                                        .allow === '*'
                                                        ? 'All packages'
                                                        : result.constraint.allow.map(
                                                            (tag) => (
                                                              <Badge variant="outline">
                                                                {tag}
                                                              </Badge>
                                                            ),
                                                          )}
                                                    </div>
                                                  </>
                                                ) : undefined}
                                                {'disallow' in
                                                result.constraint ? (
                                                  <>
                                                    <p>Disallowed:</p>
                                                    <div>
                                                      {result.constraint
                                                        .disallow === '*'
                                                        ? 'All packages'
                                                        : result.constraint.disallow.map(
                                                            (tag) => (
                                                              <Badge variant="outline">
                                                                {tag}
                                                              </Badge>
                                                            ),
                                                          )}
                                                    </div>
                                                  </>
                                                ) : undefined}

                                                <p>Found:</p>
                                                <div>
                                                  {result.foundTags
                                                    ? result.foundTags.map(
                                                        (tag) => (
                                                          <Badge variant="outline">
                                                            {tag}
                                                          </Badge>
                                                        ),
                                                      )
                                                    : 'No tags found'}
                                                </div>
                                              </div>
                                            </div>
                                          );
                                        },
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        );
                      },
                    )}
                  </div>
                </div>
              );

              return Object.entries(resultsForPackageByFilter).map(
                ([filter, resultsForFilter]) => {
                  return 'hello';
                },
              );
            })}
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

export default GraphHeader;
