'use client';
import {
  Button,
  Separator,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@commonalityco/ui-design-system';
import { EyeOff, Focus, Tags } from 'lucide-react';
import { NodeToolbar } from '@xyflow/react';
import { Position } from '@xyflow/system';
import { useAtom, useSetAtom } from 'jotai';
import { editingPackageAtom, selectedPackagesAtom } from '../atoms/graph-atoms';
import { useInteractions } from '../context/interaction-context';

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

export function PackageToolbar() {
  const [selectedPackages] = useAtom(selectedPackagesAtom);
  const setEditingPackage = useSetAtom(editingPackageAtom);
  const interactions = useInteractions();

  const isVisible = Number(selectedPackages?.length) > 0;
  const selectedNodeIds = selectedPackages.map((pkg) => pkg.name);

  return (
    <NodeToolbar
      isVisible={isVisible}
      nodeId={selectedPackages.map((pkg) => pkg.name)}
      position={Position.Bottom}
      className="bg-background border-border light flex gap-1 rounded-lg border p-1"
    >
      {selectedPackages.length === 1 ? (
        <>
          <ToolbarButton
            text="Edit tags"
            onClick={() => setEditingPackage(selectedPackages[0])}
          >
            <Tags className="h-4 w-4" />
          </ToolbarButton>
          <Separator orientation="vertical" className="my-1 h-7" />
        </>
      ) : undefined}

      <ToolbarButton
        text="Focus"
        onClick={() => interactions.focus(selectedNodeIds)}
      >
        <Focus className="h-4 w-4" />
      </ToolbarButton>

      <ToolbarButton
        text="Hide"
        onClick={() => interactions.hide(selectedNodeIds)}
      >
        <EyeOff className="h-4 w-4" />
      </ToolbarButton>
    </NodeToolbar>
  );
}
