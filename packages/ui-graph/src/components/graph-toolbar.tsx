'use client';
import React from 'react';
import {
  Separator,
  Toggle,
  Button,
  Tooltip,
  TooltipTrigger,
  TooltipProvider,
  TooltipContent,
  Popover,
  cn,
} from '@commonalityco/ui-design-system';
import {
  MinusIcon,
  Palette,
  PlusIcon,
  Maximize,
  ChevronDown,
} from 'lucide-react';
import { Violation, ProjectConfig } from '@commonalityco/types';

function ViolationsHoverCard({
  constraints = {},
  violations = [],
}: {
  constraints?: ProjectConfig['constraints'];
  violations?: Violation[];
}) {
  return (
    <Popover>
      <Button variant="ghost" size="sm" className="gap-2">
        <div
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
    </Popover>
  );
}

export interface GraphToolbarProperties {
  totalPackageCount: number;
  shownPackageCount: number;
  isEdgeColorShown?: boolean;
  onSetIsEdgeColorShown?: (isEdgeColorShown: boolean) => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onFit?: () => void;
  constraints: ProjectConfig['constraints'];
  violations: Violation[];
}

export function GraphToolbar({
  totalPackageCount = 0,
  shownPackageCount = 0,
  isEdgeColorShown,
  onSetIsEdgeColorShown = () => {},
  onZoomIn = () => {},
  onZoomOut = () => {},
  onFit = () => {},
  constraints = {},
  violations = [],
}: GraphToolbarProperties) {
  return (
    <div className="bg-background flex w-full px-3 pt-3">
      <div className="flex items-center gap-2">
        <Button variant="link" size="sm">
          {`${shownPackageCount} of ${totalPackageCount} packages`}
        </Button>

        <Separator orientation="vertical" />
        <ViolationsHoverCard
          violations={violations}
          constraints={constraints}
        />
      </div>
      <div className="grow" />
      <div className="flex items-center gap-1">
        <TooltipProvider>
          <Tooltip delayDuration={200}>
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
            <Tooltip delayDuration={200}>
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
            <Tooltip delayDuration={200}>
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
            <Tooltip delayDuration={200}>
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
