'use client';
import { useReactFlow } from '@xyflow/react';
import { GraphDirection } from './types';
import {
  Button,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
  Separator,
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
  ChevronDown,
  Maximize,
  Minus,
  Plus,
} from 'lucide-react';
import { useState } from 'react';
import { DependencyType } from '@commonalityco/utils-core';

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

function ColorDropdown({
  defaultDependencyTypes = [],
  onHighlightChange,
}: {
  defaultDependencyTypes?: DependencyType[];
  onHighlightChange: (dependencyTypes: DependencyType[]) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [checkedDependencyTypes, setCheckedDependencyTypes] = useState<
    DependencyType[]
  >(defaultDependencyTypes);

  const reactFlow = useReactFlow();

  const onColorChange = (depedencyType: DependencyType, checked: boolean) => {
    const newDependencyTypes = checked
      ? [...checkedDependencyTypes, depedencyType]
      : checkedDependencyTypes.filter((type) => type !== depedencyType);

    setCheckedDependencyTypes(newDependencyTypes);

    reactFlow.setEdges((currentEdges) =>
      currentEdges.map((currentEdge) => {
        return {
          ...currentEdge,
          data: {
            ...currentEdge.data,
            activeDependencyTypes: newDependencyTypes,
          },
        };
      }),
    );

    onHighlightChange(newDependencyTypes);
  };

  const dependencyTypeToText = {
    [DependencyType.PRODUCTION]: 'Production',
    [DependencyType.DEVELOPMENT]: 'Development',
    [DependencyType.PEER]: 'Peer',
  };

  return (
    <DropdownMenu open={isOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          onClick={() => setIsOpen(true)}
          className="flex gap-2"
        >
          Color
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56"
        onInteractOutside={() => setIsOpen(false)}
        onEscapeKeyDown={() => setIsOpen(false)}
      >
        <DropdownMenuLabel>Dependency Type</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {[
          { type: DependencyType.PRODUCTION, color: 'bg-emerald-600' },
          { type: DependencyType.DEVELOPMENT, color: 'bg-sky-600' },
          { type: DependencyType.PEER, color: 'bg-purple-600' },
        ].map(({ type, color }) => (
          <DropdownMenuCheckboxItem
            key={type}
            checked={checkedDependencyTypes.includes(type)}
            onCheckedChange={(checked) => onColorChange(type, checked)}
          >
            {dependencyTypeToText[type]}
            <DropdownMenuShortcut>
              <div className={`h-2 w-2 rounded-full ${color}`} />
            </DropdownMenuShortcut>
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function ControlBar({
  defaultDependencyTypes,
  direction,
  onDirectionChange,
  onHighlightChange,
  shownCount,
  totalCount,
}: {
  defaultDependencyTypes?: DependencyType[];
  direction: GraphDirection;
  onHighlightChange: (dependencyTypes: DependencyType[]) => void;
  onDirectionChange: (direction: GraphDirection) => void;
  shownCount: number;
  totalCount: number;
}) {
  const reactFlow = useReactFlow();

  return (
    <div className="pb-3 px-3 relative w-full bg-interactive shrink-0 flex justify-between">
      <div className="h-full flex items-center pl-2">
        <div className="text-xs text-primary font-mono leading-none font-medium font-muted-foreground">
          {`${shownCount} of ${totalCount}`}
        </div>
      </div>
      <div className="flex gap-1">
        <ColorDropdown
          onHighlightChange={onHighlightChange}
          defaultDependencyTypes={defaultDependencyTypes}
        />
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
