'use client';
import {
  
  NpmLogo,
  PnpmLogo,
  YarnLogo,
} from '@commonalityco/ui-core';
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
  Tag,
  ScrollArea,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  Label,
} from '@commonalityco/ui-design-system';
import {
  MinusIcon,
  Palette,
  PlusIcon,
  Maximize,
  ExternalLink,
  ShieldIcon,
  CornerDownRight,
} from 'lucide-react';
import { ProjectConfig, Violation, Constraint } from '@commonalityco/types';
import {  useMemo } from 'react';
import { cva } from 'class-variance-authority';

import { ConstraintDetails } from './constraint-details';
import { ConstraintAccordionTrigger } from './constraint-accordion-trigger';

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

      const currentViolations = map[violation.constraintTag];

      map[violation.constraintTag] = currentViolations
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
                const violations = violationsByConstraintTag[constraint.tag];

                if (!violations?.length) {
                  return (
                    <AccordionItem
                      key={constraint.tag}
                      value={constraint.tag}
                      className="w-full"
                    >
                      <AccordionTrigger>
                        <ConstraintAccordionTrigger
                          variant="pass"
                          constraint={constraint}
                          violations={violations}
                        />
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="grid gap-4">
                          <ConstraintDetails constraint={constraint} />
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                }

                return (
                  <AccordionItem
                    className="grid w-full gap-2"
                    key={constraint.tag}
                    value={constraint.tag}
                  >
                    <AccordionTrigger>
                      <ConstraintAccordionTrigger
                        variant="error"
                        constraint={constraint}
                        violations={violations}
                      />
                    </AccordionTrigger>
                    <AccordionContent className="w-full">
                      <div className="flex w-full flex-col gap-4">
                        <ConstraintDetails constraint={constraint} />
                        <div className="w-full">
                          <Label className="text-xs">Violations:</Label>
                          <div className="flex flex-col gap-2">
                            {violations.map((violation) => {
                              return (
                                <div className="w-full">
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
                                      <CornerDownRight className="h-4 w-4 shrink-0 text-destructive" />
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
                                  <div className="w-full pl-6">
                                    <div className="flex w-full flex-wrap gap-1">
                                      {violation.foundTags?.length ? (
                                        violation.foundTags.map((tag) => (
                                          <Tag
                                            use="secondary"
                                            key={tag}
                                            className="block min-w-0"
                                          >
                                            {`#${tag}`}
                                          </Tag>
                                        ))
                                      ) : (
                                        <p className="text-xs">No tags</p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
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
    <div className="flex w-full bg-background px-3 pb-1 pt-3">
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
        <Toggle
          onPressedChange={(pressed) => {
            onSetIsEdgeColorShown(pressed);
          }}
          pressed={isEdgeColorShown}
        >
          <Palette className="h-4 w-4" />
        </Toggle>
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
