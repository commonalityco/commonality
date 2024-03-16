'use client';
import { useReactFlow } from '@xyflow/react';
import { GraphDirection } from '../utilities/types';
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
  cn,
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
import { useDirectionQuery, useColorQuery } from '../query/query-hooks';

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

function ColorDot({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'border-muted-foreground/50 bg-muted relative h-2 w-2 rounded-full border shadow-[0_0_0_2px_hsl(var(--muted))]',
        className,
      )}
    />
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
          <div className="flex flex-nowrap items-center">
            <ColorDot
              className={cn({
                'border-emerald-600 bg-emerald-600':
                  checkedDependencyTypes.includes(DependencyType.PRODUCTION),
              })}
            />

            <ColorDot
              className={cn('-mx-0.25 z-10', {
                'border-sky-600 bg-sky-600': checkedDependencyTypes.includes(
                  DependencyType.DEVELOPMENT,
                ),
              })}
            />
            <ColorDot
              className={cn('z-20', {
                'border-purple-600 bg-purple-600':
                  checkedDependencyTypes.includes(DependencyType.PEER),
              })}
            />
          </div>
          <span className="font-mono text-xs">Dependencies</span>
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

export function GraphControlBar() {
  const [directionQuery, setDirectionQuery] = useDirectionQuery();
  const [highlightQuery, setHighlightQuery] = useColorQuery();
  const reactFlow = useReactFlow();

  return (
    <div className="bg-secondary dark:bg-background flex flex-row justify-center px-3 pb-3">
      <div className="bg-background py relative flex w-auto grow-0 justify-between rounded-lg border p-1">
        <div className="flex justify-between gap-1">
          <ColorDropdown
            onHighlightChange={setHighlightQuery}
            defaultDependencyTypes={highlightQuery}
          />
          <Separator orientation="vertical" className="my-1 h-6" />

          <ToggleGroup
            type="single"
            value={directionQuery}
            onValueChange={(direction: GraphDirection) =>
              setDirectionQuery(direction)
            }
          >
            <ButtonTooltip text="Align left to right">
              <ToggleGroupItem
                value={GraphDirection.LeftToRight}
                aria-label="Align left to right"
              >
                <ArrowRightFromLine className="h-4 w-4" />
              </ToggleGroupItem>
            </ButtonTooltip>
            <ButtonTooltip text="Align top to bottom">
              <ToggleGroupItem
                value={GraphDirection.TopToBottom}
                aria-label="Align top to bottom"
              >
                <ArrowDownFromLine className="h-4 w-4" />
              </ToggleGroupItem>
            </ButtonTooltip>
          </ToggleGroup>

          <Separator orientation="vertical" className="my-1 h-6" />

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

          <div className="hidden md:block">
            <ButtonTooltip text="Zoom out">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => reactFlow.zoomOut({ duration: 200 })}
              >
                <Minus className="h-4 w-4" />
              </Button>
            </ButtonTooltip>
          </div>

          <div className="hidden md:block">
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
      </div>
    </div>
  );
}
