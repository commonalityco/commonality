'use client';
import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@commonalityco/ui-design-system';
import { EyeOff, Focus } from 'lucide-react';
import { NodeToolbar } from '@xyflow/react';
import { Position } from '@xyflow/system';
import { useAtom } from 'jotai';
import { selectedPackagesAtom } from '../atoms/graph-atoms';
import { useInteractions } from '../context/interaction-context';

export function ToolbarButton({
  children,
  text,
  onClick,
}: {
  children: React.ReactNode;
  text: string;
  onClick?: () => void;
}) {
  return (
    <TooltipProvider delayDuration={250}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            className="text-white hover:bg-zinc-600 dark:text-zinc-500 dark:hover:bg-zinc-200"
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

export function PackageToolbar() {
  const [selectedPackages, setSelectedPackages] = useAtom(selectedPackagesAtom);
  const interactions = useInteractions();

  const isVisible = Number(selectedPackages?.length) > 0;
  const selectedNodeIds = selectedPackages.map((pkg) => pkg.name);

  return (
    <NodeToolbar
      isVisible={isVisible}
      nodeId={selectedPackages.map((pkg) => pkg.name)}
      position={Position.Bottom}
      className="bg-primary light flex origin-top gap-1 rounded-lg p-1"
    >
      <ToolbarButton
        text="Focus"
        onClick={() => {
          interactions.focus(selectedNodeIds);
          setSelectedPackages([]);
        }}
      >
        <Focus className="h-4 w-4" />
      </ToolbarButton>

      <ToolbarButton
        text="Hide"
        onClick={() => {
          interactions.hide(selectedNodeIds);
          setSelectedPackages([]);
        }}
      >
        <EyeOff className="h-4 w-4" />
      </ToolbarButton>
    </NodeToolbar>
  );
}
