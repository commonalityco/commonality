'use client';
import {
  Badge,
  Label,
  ScrollArea,
  Separator,
  cn,
} from '@commonalityco/ui-design-system';
import { Dot, Network, Package, ShieldCheck, ShieldClose } from 'lucide-react';
import { DependencyType, formatTagName } from '@commonalityco/utils-core';
import { ConstraintResult, Dependency } from '@commonalityco/types';
import { ConstraintsOnboardingCard } from './constraints-onboarding-card';

const TextByType = {
  [DependencyType.PRODUCTION]: 'production',
  [DependencyType.DEVELOPMENT]: 'development',
  [DependencyType.PEER]: 'peer',
};

function Row({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="tems-center flex flex-nowrap justify-between gap-2">
      <dt className="text-muted-foreground">{title}</dt>
      <dd>{children}</dd>
    </div>
  );
}

function IconContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-muted/50 flex h-8 w-8 items-center justify-center rounded-md border">
      {children}
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

  return (
    <div className="h-full pr-4 pt-4">
      <div className="mb-3 flex flex-nowrap items-center gap-4">
        <IconContainer>
          <Network className="h-4 w-4" />
        </IconContainer>

        <p className="text-base font-semibold">Dependency</p>
      </div>
      <Label>Details</Label>
      <dl className="py-4">
        <Row title="Source">{dependency.source}</Row>
        <Separator className="my-3" />
        <Row title="Target">{dependency.target}</Row>
        <Separator className="my-3" />
        <Row title="Type">
          <div
            className={cn('inline-block rounded-full border px-2 py-0.5', {
              'border-purple-700 bg-purple-100 dark:border-purple-600 dark:bg-purple-900':
                dependency.type === DependencyType.PEER,
              'border-sky-700 bg-sky-100 dark:border-sky-600 dark:bg-sky-900':
                dependency.type === DependencyType.DEVELOPMENT,
              'border-emerald-700 bg-emerald-100 dark:border-emerald-600 dark:bg-emerald-900':
                dependency.type === DependencyType.PRODUCTION,
            })}
          >
            <p className="flex items-center gap-2 font-mono text-xs font-medium">
              <span>{TextByType[dependency.type]}</span>
            </p>
          </div>
        </Row>
        <Separator className="my-3" />
        <Row title="Version">{dependency.version}</Row>
      </dl>
      <Label className="mb-3 inline-block">Constraints</Label>
      <ScrollArea className="h-full">
        {dependencyResults.length > 0 ? (
          dependencyResults.map((dependencyResult) => {
            return (
              <div
                className="flex flex-col gap-4 py-0"
                key={JSON.stringify(dependencyResult.dependencyPath)}
              >
                <div className="flex flex-nowrap items-center gap-2">
                  {dependencyResult.isValid ? (
                    <>
                      <ShieldCheck className="text-success h-4 w-4" />
                    </>
                  ) : (
                    <>
                      <ShieldClose className="text-destructive h-4 w-4" />
                    </>
                  )}

                  <Badge variant="secondary">{dependencyResult.filter}</Badge>
                </div>
                <div className="flex flex-col gap-2">
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
                          <Package className="h-4 w-4" /> {path.source}
                        </p>
                        {index === 0 ? (
                          <div className="border-muted-foreground my-4 ml-2 grid grid-cols-[minmax(min-content,max-content)_1fr] items-start gap-4 border-l border-dashed pl-4">
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
                                  tags={dependencyResult.constraint.disallow}
                                  labelId="disallowed"
                                  allPackagesText="All packages"
                                />
                              </>
                            ) : undefined}
                          </div>
                        ) : (
                          <div className="border-muted-foreground my-4 ml-2 h-4 border-l border-dashed" />
                        )}

                        {index + 1 ===
                        dependencyResult.dependencyPath.length ? (
                          <div className="relative">
                            <p className="text-primary flex flex-nowrap items-center gap-2">
                              <Package className="h-4 w-4" />
                              {path.target}
                            </p>
                            <div className="border-muted-foreground my-4 ml-2 grid grid-cols-[minmax(min-content,max-content)_1fr] items-start gap-4 border-l border-dashed pl-4">
                              <dt
                                id="found"
                                className="text-muted-foreground shrink-0 whitespace-nowrap"
                              >
                                Found:
                              </dt>
                              <div className="ml-2 pl-4">
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
          })
        ) : (
          <ConstraintsOnboardingCard />
        )}
      </ScrollArea>
    </div>
  );
}
