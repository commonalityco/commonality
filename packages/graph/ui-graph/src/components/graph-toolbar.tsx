'use client';
import {
  GradientFade,
  NpmLogo,
  PnpmLogo,
  YarnLogo,
} from '@commonalityco/ui-core';
import { PackageManager } from '@commonalityco/utils-core';
import {
  Separator,
  Text,
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
} from '@commonalityco/ui-design-system';
import {
  MinusIcon,
  Palette,
  PlusIcon,
  Maximize,
  Group,
  CornerDownRight,
} from 'lucide-react';
import { Violation } from '@commonalityco/types';
import { useMemo } from 'react';
import { cva } from 'class-variance-authority';

const validateDotStyles = cva('h-2 w-2 rounded-full', {
  variants: {
    variant: {
      allow: 'bg-emerald-600',
      found: 'bg-red-600',
    },
  },
});

const IconByPackageManager = {
  [PackageManager.NPM]: NpmLogo,
  [PackageManager.PNPM]: PnpmLogo,
  [PackageManager.YARN]: YarnLogo,
};

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
  violations = [],
}: {
  packageManager: PackageManager;
  totalPackageCount: number;
  shownPackageCount: number;
  isEdgeColorShown?: boolean;
  onSetIsEdgeColorShown?: (isEdgeColorShown: boolean) => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onFit?: () => void;
  onPackageClick?: (packageName: string) => void;
  violations: Violation[];
}) {
  const Icon = packageManager
    ? IconByPackageManager[packageManager]
    : undefined;

  const violationsByPackageName = useMemo(() => {
    const map: Record<string, Violation[]> = {};

    for (let i = 0; i < violations.length; i++) {
      const violation = violations[i];

      const currentViolations = map[violation.sourceName];

      map[violation.sourceName] = currentViolations
        ? [...currentViolations, violation]
        : [violation];
    }

    return map;
  }, []);

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
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button
              variant="link"
              size="sm"
            >{`${violations?.length} violations`}</Button>
          </HoverCardTrigger>
          <HoverCardContent className="grid w-auto gap-2 p-0">
            <ScrollArea className="h-full max-h-[400px] p-0">
              <div className="px-4 pt-3">
                <p>Constraints</p>
              </div>
              <div className="grid gap-4">
                {Object.keys(violationsByPackageName).map((pkgName) => {
                  const violations = violationsByPackageName[pkgName];
                  return (
                    <div key={pkgName}>
                      <div className="sticky top-0 w-full">
                        <Button
                          variant="link"
                          className="w-full justify-start bg-background px-4 py-0 font-bold"
                          onClick={() => onPackageClick(pkgName)}
                        >
                          {pkgName}
                        </Button>
                        <GradientFade placement="top" className="h-2" />
                      </div>
                      {/* <p className="mb-2 text-sm font-bold">{pkgName}</p> */}
                      <div className="grid gap-4 px-4">
                        {violations.map((violation) => {
                          return (
                            <div className="text-xs">
                              <div className="mb-1 flex flex-nowrap items-center">
                                <CornerDownRight className="h-4 w-4 text-foreground" />
                                <Button
                                  size="sm"
                                  variant="link"
                                  className="px-2"
                                  onClick={() =>
                                    onPackageClick(violation.targetName)
                                  }
                                >
                                  {violation.targetName}
                                </Button>
                              </div>
                              <div className="grid grid-cols-[auto_1fr] items-center gap-2">
                                <p>Constraint for:</p>
                                <div className="flex gap-2">
                                  {violation.matchTags?.length ? (
                                    violation.matchTags.map((tag) => {
                                      return (
                                        <Tag key={tag} use="secondary">
                                          {`#${tag}`}
                                        </Tag>
                                      );
                                    })
                                  ) : (
                                    <p>None</p>
                                  )}
                                </div>
                                <div className="flex flex-nowrap items-center gap-1">
                                  <div
                                    className={validateDotStyles({
                                      variant: 'allow',
                                    })}
                                  />
                                  <p>Allowed:</p>
                                </div>

                                <div className="flex gap-2">
                                  {violation.allowedTags?.length ? (
                                    violation.allowedTags.map((tag) => {
                                      return (
                                        <Tag key={tag} use="secondary">
                                          {`#${tag}`}
                                        </Tag>
                                      );
                                    })
                                  ) : (
                                    <p>None</p>
                                  )}
                                </div>
                                <div className="flex flex-nowrap items-center gap-1">
                                  <div
                                    className={validateDotStyles({
                                      variant: 'found',
                                    })}
                                  />
                                  <p>Found:</p>
                                </div>
                                <div className="flex gap-2">
                                  {violation.foundTags?.length ? (
                                    violation.foundTags.map((tag) => {
                                      return (
                                        <Tag key={tag} use="secondary">
                                          {`#${tag}`}
                                        </Tag>
                                      );
                                    })
                                  ) : (
                                    <p>None</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
              <GradientFade placement="bottom" className="h-3" />
            </ScrollArea>
          </HoverCardContent>
        </HoverCard>
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
