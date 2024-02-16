import {
  Button,
  Separator,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@commonalityco/ui-design-system';
import { EyeOff, Focus, Tags } from 'lucide-react';
import { Position, NodeToolbar } from 'reactflow';

function ToolbarButton({
  children,
  text,
  onClick,
}: {
  children: React.ReactNode;
  text: string;
  onClick?: () => void;
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            aria-label={text}
            onClick={onClick}
          >
            {children}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" sideOffset={8}>
          {text}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function PackageToolbar(props: {
  onEditTags: () => void;
  onFocus: () => void;
  onHide: () => void;
}) {
  return (
    <NodeToolbar
      position={Position.Bottom}
      className="flex gap-1 bg-background rounded-lg border border-border p-1"
    >
      <ToolbarButton text="Edit tags" onClick={props.onEditTags}>
        <Tags className="h-4 w-4" />
      </ToolbarButton>
      <Separator orientation="vertical" className="h-7 my-1" />
      <ToolbarButton text="Focus">
        <Focus className="h-4 w-4" />
      </ToolbarButton>

      <ToolbarButton text="Hide">
        <EyeOff className="h-4 w-4" />
      </ToolbarButton>
    </NodeToolbar>
  );
}
