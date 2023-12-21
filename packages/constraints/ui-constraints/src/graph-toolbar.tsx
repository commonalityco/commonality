'use client';
import {
  Button,
  Tooltip,
  TooltipTrigger,
  TooltipProvider,
  TooltipContent,
} from '@commonalityco/ui-design-system';
import { MinusIcon, PlusIcon, Maximize } from 'lucide-react';

export interface GraphToolbarProperties {
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onFit?: () => void;
}

export function GraphToolbar({
  onZoomIn = () => {},
  onZoomOut = () => {},
  onFit = () => {},
}: GraphToolbarProperties) {
  return (
    <div className="flex w-full px-3 pt-3">
      <div className="grow" />
      <div className="flex items-center gap-1">
        <div className="flex gap-1">
          <TooltipProvider>
            <Tooltip delayDuration={200}>
              <TooltipTrigger asChild>
                <Button
                  aria-label="Zoom in"
                  variant="outline"
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
                  variant="outline"
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
                  variant="outline"
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
