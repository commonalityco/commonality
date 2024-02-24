'use client';
import { useReactFlow } from '@xyflow/react';
import { GraphDirection } from './types';
import {
  Button,
  Separator,
  Toggle,
  ToggleGroup,
  ToggleGroupItem,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@commonalityco/ui-design-system';
import {
  ArrowDownFromLine,
  ArrowRightFromLine,
  Maximize,
  Minus,
  Palette,
  Plus,
} from 'lucide-react';

function ButtonTooltip({
  children,
  text,
}: {
  children: React.ReactNode;
  text: string;
}) {
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span>{children}</span>
        </TooltipTrigger>

        <TooltipContent>{text}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function ControlBar({
  direction,
  onDirectionChange,
  shownCount,
  totalCount,
}: {
  direction: GraphDirection;
  onDirectionChange: (direction: GraphDirection) => void;
  shownCount: number;
  totalCount: number;
}) {
  const reactFlow = useReactFlow();

  const onColorChange = (forceColor: boolean) => {
    reactFlow.setEdges((currentEdges) =>
      currentEdges.map((currentEdge) => {
        return {
          ...currentEdge,
          data: {
            ...currentEdge.data,
            forceActive: forceColor,
          },
        };
      }),
    );
  };

  return (
    <div className="pb-3 px-3 relative w-full bg-interactive shrink-0 flex justify-between">
      <div className="h-full flex items-center pl-2">
        <div className="text-xs text-primary font-mono leading-none font-medium font-muted-foreground">
          {`${shownCount} of ${totalCount}`}
        </div>
      </div>
      <div className="flex gap-1">
        <ButtonTooltip text="Show color">
          <Toggle
            aria-label="Show color"
            onPressedChange={(pressed) => {
              onColorChange(pressed);
            }}
          >
            <Palette className="h-4 w-4" />
          </Toggle>
        </ButtonTooltip>

        <Separator orientation="vertical" className="h-6 my-1 mx-2" />

        <ToggleGroup
          type="single"
          value={direction}
          onValueChange={(direction: GraphDirection) =>
            onDirectionChange(direction)
          }
        >
          <ButtonTooltip text="Align top to bottom">
            <ToggleGroupItem
              value={GraphDirection.TopToBottom}
              aria-label="Align top to bottom"
            >
              <ArrowDownFromLine className="h-4 w-4" />
            </ToggleGroupItem>
          </ButtonTooltip>

          <ButtonTooltip text="Align left to right">
            <ToggleGroupItem
              value={GraphDirection.LeftToRight}
              aria-label="Align left to right"
            >
              <ArrowRightFromLine className="h-4 w-4" />
            </ToggleGroupItem>
          </ButtonTooltip>
        </ToggleGroup>

        <Separator orientation="vertical" className="h-6 my-1 mx-2" />

        <ButtonTooltip text="Fit view">
          <Button
            aria-label="Fit view"
            size="icon"
            variant="ghost"
            onClick={() => reactFlow.fitView({ duration: 200 })}
          >
            <Maximize className="h-4 w-4" />
          </Button>
        </ButtonTooltip>

        <ButtonTooltip text="Zoom out">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => reactFlow.zoomOut({ duration: 200 })}
          >
            <Minus className="h-4 w-4" />
          </Button>
        </ButtonTooltip>
        <ButtonTooltip text="Zoom in">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => reactFlow.zoomIn({ duration: 200 })}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </ButtonTooltip>
      </div>
    </div>
  );
}
