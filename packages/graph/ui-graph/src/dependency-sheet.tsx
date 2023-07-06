import { Constraint, Dependency, Violation } from '@commonalityco/types';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  Label,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@commonalityco/ui-design-system';
import { DependencyType } from '@commonalityco/utils-core';
import { cva } from 'class-variance-authority';
import { ArrowDown, ArrowRight, CornerDownRight } from 'lucide-react';
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

function DependencySheetContent({
  constraints,
  violations,
  dependency,
  source,
  target,
}: {
  constraints: Constraint[];
  violations: Violation[];
  dependency: Dependency;
  target: string;
  source: string;
}) {
  return (
    <>
      <SheetHeader>
        <p className="text-xs text-muted-foreground">Dependency</p>
        <SheetTitle className="grid gap-1">
          <span>{source}</span>
          <div className="flex flex-nowrap items-center gap-2">
            <CornerDownRight className="h-4 w-4" />
            <span>{target}</span>
          </div>
        </SheetTitle>
      </SheetHeader>
      <div className="grid gap-2 pt-4">
        <div>
          <Label className="mb-1">Type</Label>
          <div className="flex flex-nowrap items-center gap-2">
            <div className={statusDotStyles({ type: dependency.type })} />
            <p>{TextByType[dependency.type]}</p>
          </div>
        </div>
        <div>
          <Label className="mb-1">Version range</Label>
          <p>
            {dependency.version ? (
              <span className="font-mono">{dependency.version}</span>
            ) : (
              'No version'
            )}
          </p>
        </div>
        <div>
          <Label className="mb-1">Constraints</Label>
          <Accordion type="multiple">
            {constraints.map((constraint) => {
              return (
                <AccordionItem key={constraint.tag} value={constraint.tag}>
                  <AccordionTrigger></AccordionTrigger>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      </div>
    </>
  );
}

interface DependencySheetProps extends ComponentProps<typeof Sheet> {
  constraints: Constraint[];
  violations: Violation[];
  dependency?: Dependency;
  target: string;
  source: string;
}

export function DependencySheet(props: DependencySheetProps) {
  return (
    <Sheet {...props}>
      <SheetContent className="sm:max-w-[300px] md:max-w-[550px]">
        {props.dependency && (
          <DependencySheetContent
            constraints={props.constraints}
            violations={props.violations}
            dependency={props.dependency}
            target={props.target}
            source={props.source}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}
