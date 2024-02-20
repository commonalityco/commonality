import {
  Button,
  Separator,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@commonalityco/ui-design-system';
import { EyeOff, Focus, Tags } from 'lucide-react';
import { NodeToolbar, Node, Edge, OnSelectionChangeFunc } from '@xyflow/react';
import { DependencyEdgeData, PackageNodeData, useInteractions } from '..';
import { Position } from '@xyflow/system';

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
  onEditTags: (packageName: string) => void;
  selectedNodeIds: string[];
  nodes: Node<PackageNodeData>[];
  edges: Edge<DependencyEdgeData>[];
  direction?: 'TB' | 'LR';
  isVisible?: boolean;
  onChange: OnSelectionChangeFunc;
}) {
  const interactions = useInteractions({
    nodes: props.nodes,
    edges: props.edges,
    onChange: props.onChange ?? (() => {}),
  });

  const isVisible = Number(props.selectedNodeIds?.length) > 0;

  return (
    <NodeToolbar
      isVisible={isVisible}
      nodeId={props.selectedNodeIds}
      position={Position.Bottom}
      className="flex gap-1 bg-background rounded-lg border border-border p-1"
    >
      {Number(props.selectedNodeIds.length) === 1 ? (
        <>
          <ToolbarButton
            text="Edit tags"
            onClick={() => props.onEditTags(props.selectedNodeIds[0])}
          >
            <Tags className="h-4 w-4" />
          </ToolbarButton>
          <Separator orientation="vertical" className="h-7 my-1" />
        </>
      ) : undefined}

      <ToolbarButton
        text="Focus"
        onClick={() => interactions.focus(props.selectedNodeIds)}
      >
        <Focus className="h-4 w-4" />
      </ToolbarButton>

      <ToolbarButton
        text="Hide"
        onClick={() => interactions.hide(props.selectedNodeIds)}
      >
        <EyeOff className="h-4 w-4" />
      </ToolbarButton>
    </NodeToolbar>
  );
}
