'use client';
import React from 'react';
import { NpmLogo, PnpmLogo, YarnLogo } from '@commonalityco/ui-core';
import { PackageManager } from '@commonalityco/utils-core';
import {
  Separator,
  Toggle,
  Button,
  Tooltip,
  TooltipTrigger,
  TooltipProvider,
  TooltipContent,
  HoverCard,
  HoverCardTrigger,
  ScrollArea,
  Accordion,
  AccordionContent,
  Popover,
  PopoverTrigger,
  PopoverContent,
  cn,
} from '@commonalityco/ui-design-system';
import {
  MinusIcon,
  Palette,
  PlusIcon,
  Maximize,
  ExternalLink,
  ShieldIcon,
  CornerDownRight,
  ShieldCheck,
  ShieldClose,
  ChevronDown,
} from 'lucide-react';
import { Violation, Constraint } from '@commonalityco/types';
import { useMemo } from 'react';
import { ConstraintAccordionItem } from './constraint-accordion-item.js';
import { ConstraintAccordionTrigger } from './constraint-accordion-trigger.js';
import { ConstraintResult } from './constraint-result.js';

function ViolationsHoverCard({
  constraints = [],
  violations = [],
  onPackageClick = () => {},
}: {
  constraints?: Constraint[];
  violations?: Violation[];
  onPackageClick: (packageName: string) => void;
}) {
  const violationsByConstraintTag = useMemo(() => {
    const map: Record<string, Violation[] | undefined> = {};

    for (const violation of violations) {
      const currentViolations = map[violation.appliedTo];

      map[violation.appliedTo] = currentViolations
        ? [...currentViolations, violation]
        : [violation];
    }

    return map;
  }, [violations]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <div
            // className={validateDotStyles({
            //   variant: violations.length ? 'destructive' : 'success',
            // })}
            className={cn('h-2 w-2 rounded-full', {
              'bg-success': violations.length === 0,
              'bg-destructive': violations.length,
            })}
          />
          {`${constraints.length} constraints with ${
            violations?.length ?? 0
          } violations`}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="grid w-auto p-0" align="start">
        {constraints.length > 0 ? (
          <ScrollArea className="h-full max-h-[400px] px-4 pb-0 pt-0">
            <Accordion
              type="multiple"
              className="h-full min-w-[250px] max-w-[400px]"
              defaultValue={Object.keys(violationsByConstraintTag)}
            >
              {constraints.map((constraint) => {
                const violations =
                  violationsByConstraintTag[constraint.applyTo];

                return (
                  <ConstraintAccordionItem
                    constraint={constraint}
                    key={constraint.applyTo}
                  >
                    <ConstraintAccordionTrigger
                      variant={violations?.length ? 'error' : 'pass'}
                      constraint={constraint}
                    ></ConstraintAccordionTrigger>
                    <AccordionContent>
                      <div className="mb-2 flex items-center space-x-2">
                        {violations?.length ? (
                          <ShieldClose className="text-destructive h-4 w-4" />
                        ) : (
                          <ShieldCheck className="text-success h-4 w-4" />
                        )}
                        <p className="text-sm font-semibold">{`${
                          violations?.length ?? 0
                        } violations`}</p>
                      </div>
                      <div className="space-y-2">
                        {violations?.length ? (
                          violations?.map((violation) => {
                            return (
                              <div
                                className="space-y-1"
                                key={`${violation.sourcePackageName}${violation.targetPackageName}`}
                              >
                                <div>
                                  <Button
                                    className="block h-auto w-full truncate px-0 py-1 text-left text-xs font-semibold"
                                    size="sm"
                                    variant="link"
                                    onClick={() =>
                                      onPackageClick(
                                        violation.sourcePackageName,
                                      )
                                    }
                                  >
                                    {violation.sourcePackageName}
                                  </Button>
                                  <div className="flex items-center gap-2">
                                    <CornerDownRight className="text-destructive h-5 w-5 shrink-0" />
                                    <Button
                                      className="block h-auto truncate px-0 py-1 text-left text-xs font-semibold"
                                      size="sm"
                                      variant="link"
                                      onClick={() =>
                                        onPackageClick(
                                          violation.targetPackageName,
                                        )
                                      }
                                    >
                                      {violation.targetPackageName}
                                    </Button>
                                  </div>
                                </div>
                                <div className="pl-7">
                                  <ConstraintResult
                                    constraint={constraint}
                                    violation={violation}
                                  />
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <ConstraintResult constraint={constraint} />
                        )}
                      </div>
                    </AccordionContent>
                  </ConstraintAccordionItem>
                );
              })}
            </Accordion>
          </ScrollArea>
        ) : (
          <div className="w-64 p-4 text-center">
            <ShieldIcon className="mx-auto h-6 w-6" />
            <p className="mb-1 mt-2 text-xs font-bold">No constraints found</p>
            <p className="mb-3 text-xs">
              Create constraints to enforce boundaries in your dependency graph.
            </p>
            <Button variant="secondary" size="sm" className="w-full" asChild>
              <a
                href="https://comonality.co/docs/constraints"
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn more
                <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

const IconByPackageManager = {
  [PackageManager.NPM]: NpmLogo,
  [PackageManager.PNPM]: PnpmLogo,
  [PackageManager.YARN]: YarnLogo,
};

export interface GraphToolbarProperties {
  packageManager?: PackageManager;
  totalPackageCount: number;
  shownPackageCount: number;
  isEdgeColorShown?: boolean;
  onSetIsEdgeColorShown?: (isEdgeColorShown: boolean) => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onFit?: () => void;
  onPackageClick: (packageName: string) => void;
  constraints: Constraint[];
  violations: Violation[];
}

export function GraphToolbar({
  packageManager,
  totalPackageCount = 0,
  shownPackageCount = 0,
  isEdgeColorShown,
  onSetIsEdgeColorShown = () => {},
  onZoomIn = () => {},
  onZoomOut = () => {},
  onFit = () => {},
  onPackageClick = () => {},
  constraints = [],
  violations = [],
}: GraphToolbarProperties) {
  const Icon = packageManager
    ? IconByPackageManager[packageManager]
    : undefined;

  return (
    <div className="bg-background flex w-full px-3 pt-3">
      <div className="flex items-center gap-2">
        <div className="flex flex-nowrap items-center gap-2 pl-2">
          {Icon && <Icon />}
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button variant="link" size="sm">
                {`${shownPackageCount} of ${totalPackageCount} packages`}
              </Button>
            </HoverCardTrigger>
          </HoverCard>
        </div>
        <Separator orientation="vertical" />
        <ViolationsHoverCard
          onPackageClick={onPackageClick}
          violations={violations}
          constraints={constraints}
        />
      </div>
      <div className="grow" />
      <div className="flex items-center gap-1">
        <TooltipProvider>
          <Tooltip>
            <Toggle
              asChild
              onPressedChange={(pressed) => {
                onSetIsEdgeColorShown(pressed);
              }}
              pressed={isEdgeColorShown}
            >
              <TooltipTrigger>
                <Palette className="h-4 w-4" />
              </TooltipTrigger>
            </Toggle>
            <TooltipContent>Toggle dependency colors</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Separator orientation="vertical" />
        <div className="flex gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  aria-label="Zoom in"
                  variant="ghost"
                  size="icon"
                  onClick={() => onZoomIn()}
                >
                  <PlusIcon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom in</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  aria-label="Zoom out"
                  variant="ghost"
                  size="icon"
                  onClick={() => onZoomOut()}
                >
                  <MinusIcon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom out</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Show entire graph"
                  onClick={() => onFit()}
                >
                  <Maximize className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Fit graph</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
}
