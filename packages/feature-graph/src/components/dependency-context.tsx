'use client';
import {
  Badge,
  Card,
  Label,
  ScrollArea,
  Separator,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  cn,
} from '@commonalityco/ui-design-system';
import {
  CornerDownRight,
  Dot,
  Network,
  Package,
  ShieldCheck,
  ShieldClose,
} from 'lucide-react';
import { DependencyType, formatTagName } from '@commonalityco/utils-core';
import { ConstraintResult, Dependency } from '@commonalityco/types';
import { ConstraintsOnboardingCard } from './constraints-onboarding-card';
import { GradientFade } from '@commonalityco/ui-core';

const TextByType = {
  [DependencyType.PRODUCTION]: 'production',
  [DependencyType.DEVELOPMENT]: 'development',
  [DependencyType.PEER]: 'peer',
};

function IconContainer({ type }: { type: DependencyType }) {
  return (
    <div
      className={cn(
        'flex h-8 w-8 items-center justify-center rounded-md border',
        {
          'border-purple-700 bg-purple-100 text-purple-900 dark:border-purple-600 dark:bg-purple-950 dark:text-purple-100':
            type === DependencyType.PEER,
          'border-sky-700 bg-sky-100 text-sky-900 dark:border-sky-600 dark:bg-sky-950 dark:text-sky-100':
            type === DependencyType.DEVELOPMENT,
          'border-emerald-700 bg-emerald-100 text-emerald-900 dark:border-emerald-600 dark:bg-emerald-950 dark:text-emerald-100':
            type === DependencyType.PRODUCTION,
        },
      )}
    >
      <Network className="h-4 w-4" />
    </div>
  );
}

function ConstraintsTagsContainer({
  tags,

  labelId,
  allPackagesText,
}: {
  tags: string[] | '*';
  labelId: string;
  allPackagesText: string;
}) {
  return (
    <div>
      <TagsContainer aria-labelledby={labelId}>
        {tags === '*' ? (
          <span>{allPackagesText}</span>
        ) : (
          tags.map((tag) => {
            return (
              <Badge
                role="tag"
                aria-label={tag}
                variant="outline"
                key={tag}
                className={cn('inline-block truncate')}
              >
                {formatTagName(tag)}
              </Badge>
            );
          })
        )}
      </TagsContainer>
    </div>
  );
}

function TagsContainer({
  children,
  ...rest
}: { children: React.ReactNode } & React.ComponentProps<'dd'>) {
  return (
    <dd className="flex flex-wrap gap-1 overflow-hidden" {...rest}>
      {children}
    </dd>
  );
}

export function DependencyContext({
  constraintResults,
  dependency,
}: {
  constraintResults: ConstraintResult[];
  dependency: Dependency;
}) {
  const dependencyResults = constraintResults.filter((result) =>
    result.dependencyPath.some(
      (path) =>
        path.source === dependency.source &&
        path.target === dependency.target &&
        path.type === dependency.type,
    ),
  );
  const invalidCount = dependencyResults.filter(
    (result) => !result.isValid,
  ).length;
  const validCount = dependencyResults.length - invalidCount;

  return (
    <div className="flex h-full flex-col pr-4 pt-4">
      <div className="mb-2 flex flex-nowrap items-center gap-4">
        <IconContainer type={dependency.type} />
      </div>
      <div>
        <p className="text-xl font-semibold">{dependency.source}</p>
        <div className="flex flex-nowrap items-start gap-2">
          <CornerDownRight className="mt-2 h-4 w-4" />
          <p className="min-w-0 text-xl font-semibold">{dependency.target}</p>
        </div>
      </div>
      <ScrollArea className="h-full pr-4">
        <GradientFade placement="top" />
        <div className="grid grid-cols-[auto_1fr] gap-4">
          <Label className="leading-1.5 text-muted-foreground">Version</Label>
          <p>{dependency.version}</p>
          <Label className="leading-1.5 text-muted-foreground">Type</Label>
          <div>
            <div
              className={cn('inline-block rounded-full border px-2 py-0.5', {
                'border-purple-700 bg-purple-100 text-purple-900 dark:border-purple-600 dark:bg-purple-950 dark:text-purple-100':
                  dependency.type === DependencyType.PEER,
                'border-sky-700 bg-sky-100 text-sky-900 dark:border-sky-600 dark:bg-sky-950 dark:text-sky-100':
                  dependency.type === DependencyType.DEVELOPMENT,
                'border-emerald-700 bg-emerald-100 text-emerald-900 dark:border-emerald-600 dark:bg-emerald-950 dark:text-emerald-100':
                  dependency.type === DependencyType.PRODUCTION,
              })}
            >
              <p className="flex items-center gap-2 font-mono text-xs font-semibold text-inherit">
                <span>{TextByType[dependency.type]}</span>
              </p>
            </div>
          </div>
        </div>
        <Separator className="my-6" />

        <Label className="mb-4 inline-block">Constraints</Label>

        {dependencyResults.length > 0 ? (
          <>
            <div className="mb-4 grid grid-cols-2 gap-4">
              <Card className="flex flex-row items-center justify-start gap-4 px-4 py-2 shadow-none">
                <Label className="inline-block grow truncate">Valid</Label>
                <p
                  className={cn('text-right text-2xl font-semibold', {
                    'text-success': validCount > 0,
                    'text-muted-foreground': validCount === 0,
                  })}
                >
                  {validCount}
                </p>
              </Card>
              <Card className="flex flex-row items-center justify-start gap-4 px-4 py-2 shadow-none">
                <Label className="inline-block grow truncate">Invalid</Label>
                <p
                  className={cn('text-right text-2xl font-semibold', {
                    'text-destructive': invalidCount > 0,
                    'text-muted-foreground': invalidCount === 0,
                  })}
                >
                  {invalidCount}
                </p>
              </Card>
            </div>

            <div className="flex flex-col">
              {dependencyResults.map((dependencyResult) => {
                return (
                  <div
                    className="mb-4 flex flex-col rounded-md border p-4"
                    key={JSON.stringify(dependencyResult.dependencyPath)}
                  >
                    <div className="flex flex-nowrap items-center gap-2">
                      <TooltipProvider delayDuration={300}>
                        <Tooltip>
                          <TooltipTrigger>
                            {dependencyResult.isValid ? (
                              <>
                                <ShieldCheck className="text-success h-4 w-4" />
                              </>
                            ) : (
                              <>
                                <ShieldClose className="text-destructive h-4 w-4" />
                              </>
                            )}
                          </TooltipTrigger>
                          <TooltipContent>
                            {dependencyResult.isValid
                              ? 'Valid constraint'
                              : 'Invalid constraint'}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider delayDuration={300}>
                        <Tooltip>
                          <TooltipTrigger>
                            <p className="text-base font-semibold">
                              {dependencyResult.filter}
                            </p>
                          </TooltipTrigger>
                          <TooltipContent>
                            {dependencyResult.filter === '*'
                              ? 'This constraint is applied to all packages'
                              : `This constraint is applied to packages with this tag`}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Separator className="my-6" />
                    <div className="flex flex-col gap-2">
                      <p className="text-xs font-semibold">Dependency path</p>

                      <div className="grid">
                        {dependencyResult.dependencyPath.map((path, index) => (
                          <div key={index}>
                            <p
                              className={cn(
                                `text-muted-foreground flex flex-nowrap items-center gap-2`,
                                {
                                  'text-primary': index === 0,
                                },
                              )}
                            >
                              <Package className="h-4 w-4" />
                              <span className="font-medium">{path.source}</span>
                            </p>
                            {index === 0 ? (
                              <div className="border-muted-foreground my-2 ml-2 grid grid-cols-[minmax(min-content,max-content)_1fr] items-start gap-4 border-l border-dashed pl-4">
                                {'allow' in dependencyResult.constraint ? (
                                  <>
                                    <dt
                                      id="allowed"
                                      className="text-muted-foreground shrink-0 whitespace-nowrap"
                                    >
                                      Allowed:
                                    </dt>
                                    <ConstraintsTagsContainer
                                      tags={dependencyResult.constraint.allow}
                                      labelId="allowed"
                                      allPackagesText="All packages"
                                    />
                                  </>
                                ) : undefined}
                                {'disallow' in dependencyResult.constraint ? (
                                  <>
                                    <dt
                                      id="disallowed"
                                      className="text-muted-foreground shrink-0 whitespace-nowrap"
                                    >
                                      Disallowed:
                                    </dt>
                                    <ConstraintsTagsContainer
                                      tags={
                                        dependencyResult.constraint.disallow
                                      }
                                      labelId="disallowed"
                                      allPackagesText="All packages"
                                    />
                                  </>
                                ) : undefined}
                              </div>
                            ) : (
                              <div className="border-muted-foreground my-2 ml-2 h-4 border-l border-dashed" />
                            )}

                            {index + 1 ===
                            dependencyResult.dependencyPath.length ? (
                              <div className="relative">
                                <p className="text-primary flex flex-nowrap items-center gap-2">
                                  <Package className="h-4 w-4" />
                                  <span className="font-medium">
                                    {path.target}
                                  </span>
                                </p>
                                <div className="border-muted-foreground my-2 ml-2 grid grid-cols-[minmax(min-content,max-content)_1fr] items-start gap-4 border-l border-dashed pl-4">
                                  <dt
                                    id="found"
                                    className="text-muted-foreground shrink-0 whitespace-nowrap"
                                  >
                                    Found:
                                  </dt>
                                  <div className="ml-2">
                                    <ConstraintsTagsContainer
                                      tags={dependencyResult.foundTags || []}
                                      labelId="found"
                                      allPackagesText="No tags found"
                                    />
                                  </div>
                                </div>
                                <Dot className="text-muted-foreground absolute -bottom-2.5 -left-1 z-10 h-6 w-6 translate-x-[0.25px]" />
                              </div>
                            ) : undefined}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <ConstraintsOnboardingCard />
        )}
        <GradientFade placement="bottom" />
      </ScrollArea>
    </div>
  );
}
