'use client';
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
  HoverCardContent,
  Badge,
  ScrollArea,
  Accordion,
  Label,
  AccordionContent,
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
} from 'lucide-react';
import { ProjectConfig, Violation, Constraint } from '@commonalityco/types';
import { useMemo } from 'react';
import { cva } from 'class-variance-authority';
import { ConstraintAccordionItem } from './constraint-accordion-item';
import { ConstraintAccordionTrigger } from './constraint-accordion-trigger';
import { ConstraintResult } from './constraint-result';

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

    for (let i = 0; i < violations.length; i++) {
      const violation = violations[i];

      const currentViolations = map[violation.appliedTo];

      map[violation.appliedTo] = currentViolations
        ? [...currentViolations, violation]
        : [violation];
    }

    return map;
  }, [violations]);

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link" size="sm" className="gap-2">
          <div
            className={validateDotStyles({
              variant: violations.length ? 'destructive' : 'success',
            })}
          />
          {`${constraints.length} constraints with ${
            violations?.length ?? 0
          } violations`}
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="grid w-auto p-0">
        {constraints.length ? (
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
                              <div className="space-y-1">
                                <div>
                                  <Button
                                    className="block h-auto w-full truncate px-0 py-1 text-left text-xs font-semibold"
                                    size="sm"
                                    variant="link"
                                    onClick={() =>
                                      onPackageClick(
                                        violation.sourcePackageName
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
                                          violation.targetPackageName
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
            <Button variant="secondary" size="sm" className="w-full">
              Learn more
              <ExternalLink className="ml-1 h-3 w-3" />
            </Button>
          </div>
        )}
      </HoverCardContent>
    </HoverCard>
  );
}

const validateDotStyles = cva('h-2 w-2 rounded-full', {
  variants: {
    variant: {
      success: 'bg-emerald-600',
      destructive: 'bg-destructive',
    },
  },
});

const IconByPackageManager = {
  [PackageManager.NPM]: NpmLogo,
  [PackageManager.PNPM]: PnpmLogo,
  [PackageManager.YARN]: YarnLogo,
};

export interface GraphToolbarProps {
  packageManager: PackageManager;
  totalPackageCount: number;
  shownPackageCount: number;
  isEdgeColorShown?: boolean;
  onSetIsEdgeColorShown?: (isEdgeColorShown: boolean) => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onFit?: () => void;
  onPackageClick: (packageName: string) => void;
  projectConfig: ProjectConfig;
  violations: Violation[];
}

export function GraphToolbar({
  packageManager,
  totalPackageCount = 0,
  shownPackageCount = 0,
  isEdgeColorShown = false,
  onSetIsEdgeColorShown = () => {},
  onZoomIn = () => {},
  onZoomOut = () => {},
  onFit = () => {},
  onPackageClick = () => {},
  projectConfig = {},
  violations = [],
}: GraphToolbarProps) {
  const Icon = packageManager
    ? IconByPackageManager[packageManager]
    : undefined;

  return (
    <div className="bg-background flex w-full px-3 pb-1 pt-3">
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
          constraints={projectConfig.constraints}
        />
      </div>
      <div className="grow" />
      <div className="flex items-center gap-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                onPressedChange={(pressed) => {
                  onSetIsEdgeColorShown(pressed);
                }}
                pressed={isEdgeColorShown}
              >
                <Palette className="h-4 w-4" />
              </Toggle>
            </TooltipTrigger>
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
                >
                  <Maximize className="h-4 w-4" onClick={() => onFit()} />
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
