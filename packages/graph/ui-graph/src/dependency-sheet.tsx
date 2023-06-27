import { Dependency } from '@commonalityco/types';
import {
  Label,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@commonalityco/ui-design-system';
import { DependencyType } from '@commonalityco/utils-core';
import { cva } from 'class-variance-authority';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { ComponentProps } from 'react';

const statusDotStyles = cva('h-2 w-2 rounded-full', {
  variants: {
    type: {
      PRODUCTION: 'bg-green-600',
      DEVELOPMENT: 'bg-blue-600',
      PEER: 'bg-purple-600',
    },
  },
});

const TextByType: Record<DependencyType, string> = {
  [DependencyType.PRODUCTION]: 'Production',
  [DependencyType.DEVELOPMENT]: 'Development',
  [DependencyType.PEER]: 'Peer',
};

interface DependencySheetProps extends ComponentProps<typeof Sheet> {
  edge?: Partial<cytoscape.EdgeSingular> & {
    data: () => Dependency;
  };
}

export function DependencySheet(props: DependencySheetProps) {
  if (!props.edge) {
    return null;
  }

  const dependency: Dependency & { target: string; source: string } =
    props.edge.data();

  return (
    <Sheet {...props}>
      <SheetContent>
        <SheetHeader>
          <p className="text-xs text-muted-foreground">Dependency</p>
          <SheetTitle className="grid gap-2">
            <span>{dependency.source}</span>
            <ArrowDown className="h-4 w-4" />
            <span>{dependency.target}</span>
          </SheetTitle>
        </SheetHeader>
        <div className="grid gap-2 pt-4">
          <div>
            <Label>Type</Label>
            <div className="flex flex-nowrap items-center gap-2">
              <div className={statusDotStyles({ type: dependency.type })} />
              <p>{TextByType[dependency.type]}</p>
            </div>
          </div>
          <div>
            <Label>Version range</Label>
            <p>
              {dependency.version ? (
                <span className="font-mono">{dependency.version}</span>
              ) : (
                'No version'
              )}
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
