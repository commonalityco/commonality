'use client';
import { ConstraintResult } from '@commonalityco/types';
import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  ScrollArea,
  cn,
} from '@commonalityco/ui-design-system';
import { ComponentProps } from 'react';
import { Package, Dot, ShieldX } from 'lucide-react';
import { formatTagName } from '@commonalityco/utils-core';

function TagsContainer({
  children,
  ...rest
}: { children: React.ReactNode } & ComponentProps<'dd'>) {
  return (
    <dd className="flex flex-wrap gap-1 overflow-hidden" {...rest}>
      {children}
    </dd>
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
                className={cn('truncate inline-block')}
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

export function ConstraintsDialog({
  result,
  ...props
}: ComponentProps<typeof Dialog> & {
  result: ConstraintResult;
}) {
  return (
    <Dialog {...props}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <div className="flex flex-nowrap items-center gap-4">
              <div className="h-8 w-8 rounded-md border border-border flex items-center justify-center">
                <ShieldX className="h-4 w-4 text-destructive" />
              </div>
              <span>Invalid constraint</span>
            </div>
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[450px]">
          <div className="flex flex-col gap-4 py-0 pl-2">
            <div className="flex flex-col gap-2">
              <div className="grid">
                {result.dependencyPath.map((path, index) => (
                  <div key={index}>
                    <p
                      className={cn(
                        `flex gap-2 flex-nowrap text-muted-foreground items-center`,
                        {
                          'text-primary': index === 0,
                        },
                      )}
                    >
                      <Package className="h-4 w-4" /> {path.source}
                    </p>
                    {index === 0 ? (
                      <div className="grid gap-4 grid-cols-[minmax(min-content,max-content)_1fr] ml-2 my-4 pl-4 items-center border-l border-muted-foreground border-dashed">
                        {'allow' in result.constraint ? (
                          <>
                            <dt
                              id="allowed"
                              className="shrink-0 whitespace-nowrap"
                            >
                              Allowed:
                            </dt>
                            <ConstraintsTagsContainer
                              tags={result.constraint.allow}
                              labelId="allowed"
                              allPackagesText="All packages"
                            />
                          </>
                        ) : undefined}
                        {'disallow' in result.constraint ? (
                          <>
                            <dt
                              id="disallowed"
                              className="shrink-0 whitespace-nowrap"
                            >
                              Disallowed:
                            </dt>
                            <ConstraintsTagsContainer
                              tags={result.constraint.disallow}
                              labelId="disallowed"
                              allPackagesText="All packages"
                            />
                          </>
                        ) : undefined}
                      </div>
                    ) : (
                      <div className="ml-2 h-4 border-l border-muted-foreground border-dashed my-4" />
                    )}

                    {index + 1 === result.dependencyPath.length ? (
                      <div className="relative">
                        <p className="flex gap-2 flex-nowrap text-primary items-center">
                          <Package className="h-4 w-4" />
                          {path.target}
                        </p>
                        <div className="grid gap-4 grid-cols-[minmax(min-content,max-content)_1fr] ml-2 my-4 pl-4 items-center border-l border-muted-foreground border-dashed">
                          <dt id="found" className="shrink-0 whitespace-nowrap">
                            Found:
                          </dt>
                          <div className="ml-2 pl-4">
                            <ConstraintsTagsContainer
                              tags={result.foundTags || []}
                              labelId="found"
                              allPackagesText="No tags found"
                            />
                          </div>
                        </div>
                        <Dot className="absolute h-6 w-6 -bottom-2.5 -left-1 z-10 text-muted-foreground translate-x-[0.25px]" />
                      </div>
                    ) : undefined}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => props.onOpenChange?.(false)}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
