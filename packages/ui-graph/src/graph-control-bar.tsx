'use client';
import { useReactFlow } from '@xyflow/react';
import { GraphDirection } from './types';
import { Button, Separator } from '@commonalityco/ui-design-system';
import {
  ArrowDownFromLine,
  ArrowRightFromLine,
  Maximize,
  Minus,
  Plus,
} from 'lucide-react';

export function ControlBar({
  onDirectionChange,
  shownCount,
  totalCount,
}: {
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
        <Button
          size="icon"
          variant="ghost"
          onClick={() => onDirectionChange(GraphDirection.TopToBottom)}
        >
          <ArrowDownFromLine className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => onDirectionChange(GraphDirection.LeftToRight)}
        >
          <ArrowRightFromLine className="h-4 w-4" />
        </Button>
        <Separator orientation="vertical" className="h-6 my-1 mx-2" />
        <Button
          size="icon"
          variant="ghost"
          onClick={() => reactFlow.fitView({ duration: 200 })}
        >
          <Maximize className="h-4 w-4" />
        </Button>

        <Button
          size="icon"
          variant="ghost"
          onClick={() => reactFlow.zoomOut({ duration: 200 })}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => reactFlow.zoomIn({ duration: 200 })}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
