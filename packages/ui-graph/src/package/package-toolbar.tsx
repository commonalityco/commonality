import {
  Button,
  Separator,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@commonalityco/ui-design-system';
import { EyeOff, Focus, Tags } from 'lucide-react';
import {
  Position,
  NodeToolbar,
  useReactFlow,
  getIncomers,
  getOutgoers,
} from 'reactflow';

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
  nodeIds: string[];
  isVisible?: boolean;
}) {
  const reactFlow = useReactFlow();

  const onFocus = () => {
    const nodes = reactFlow.getNodes();
    const edges = reactFlow.getEdges();

    const selectedNodes = nodes.filter((node) =>
      props.nodeIds.includes(node.id),
    );

    if (selectedNodes.length === 0) return;

    const incomers = selectedNodes.flatMap((selectedNode) =>
      getIncomers(selectedNode, nodes, edges),
    );

    const outgoers = selectedNodes.flatMap((selectedNode) =>
      getOutgoers(selectedNode, nodes, edges),
    );

    const neighbors = [...selectedNodes, ...incomers, ...outgoers];

    reactFlow.setNodes(() => neighbors);
  };

  const onHide = () => {
    reactFlow.setNodes((currentNodes) => {
      return currentNodes.filter((currentNode) =>
        props.nodeIds.every((nodeId) => nodeId !== currentNode.id),
      );
    });
  };

  return (
    <NodeToolbar
      isVisible={Number(props.nodeIds?.length) > 0}
      nodeId={props.nodeIds}
      position={Position.Bottom}
      className="flex gap-1 bg-background rounded-lg border border-border p-1"
    >
      {Number(props.nodeIds.length) === 1 ? (
        <>
          <ToolbarButton
            text="Edit tags"
            onClick={() => props.onEditTags(props.nodeIds[0])}
          >
            <Tags className="h-4 w-4" />
          </ToolbarButton>
          <Separator orientation="vertical" className="h-7 my-1" />
        </>
      ) : undefined}

      <ToolbarButton text="Focus" onClick={onFocus}>
        <Focus className="h-4 w-4" />
      </ToolbarButton>

      <ToolbarButton text="Hide" onClick={onHide}>
        <EyeOff className="h-4 w-4" />
      </ToolbarButton>
    </NodeToolbar>
  );
}
