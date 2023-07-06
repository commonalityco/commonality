/* eslint-disable @typescript-eslint/no-empty-function */
'use client';
import { Package } from '@commonalityco/types';
import { Button, Text, Tag } from '@commonalityco/ui-design-system';
import { getIconForPackage } from '@commonalityco/utils-package';
import type cytoscape from 'cytoscape';
import { ComponentProps } from 'react';
import { Package as PackageIcon, ArrowUp, ArrowDown } from 'lucide-react';
import { GraphTooltip } from './components/graph-tooltip';

export interface TooltipPackageProperties {
  onHide?: (pkg: Package) => void;
  onFocus?: (pkg: Package) => void;
  onDependenciesShow?: (pkg: Package) => void;
  onDependenciesHide?: (pkg: Package) => void;
  onDependentsShow?: (pkg: Package) => void;
  onDependentsHide?: (pkg: Package) => void;
  traversalNode: cytoscape.NodeSingular & { data: () => Package };
  renderNode: cytoscape.NodeSingular & { data: () => Package };
  stripScope?: boolean;
}

function DropdownButton({
  children,
  ...restProperties
}: ComponentProps<typeof Button>) {
  return (
    <Button
      variant="secondary"
      className="flex w-full justify-center px-2 last:mb-0"
      {...restProperties}
    >
      {children}
    </Button>
  );
}

export const TooltipPackage = ({
  onHide = () => {},
  onFocus = () => {},
  onDependenciesShow = () => {},
  onDependenciesHide = () => {},
  onDependentsShow = () => {},
  onDependentsHide = () => {},
  renderNode,
  traversalNode,
  stripScope = false,
}: TooltipPackageProperties) => {
  const pkg: Package = renderNode.data();
  const Icon = getIconForPackage(pkg);

  const dependentsCount = traversalNode.incomers().nodes().length;
  const dependenciesCount = traversalNode.outgoers().nodes().length;

  return (
    <GraphTooltip element={renderNode}>
      <div className="flex max-w-fit flex-nowrap rounded-md bg-background p-3 font-sans">
        <div className="grid w-48 auto-rows-min items-start gap-3">
          <div className="grid gap-2">
            <div className="flex items-center gap-1">
              <PackageIcon className="h-4 w-4" />
              <Text className="font-medium text-foreground">Package</Text>
            </div>
            <div className="flex flex-nowrap items-center gap-1">
              <DropdownButton onClick={() => onFocus(pkg)}>
                Focus
              </DropdownButton>
              <DropdownButton onClick={() => onHide(pkg)}>Hide</DropdownButton>
            </div>
          </div>
          <div className="grid gap-2">
            <div className="flex items-center gap-1">
              <ArrowUp className="h-4 w-4" />
              <Text className="font-medium text-foreground">Dependents</Text>
              <div className="grow text-right">
                <Tag use="outline" className="text-xs">
                  {dependentsCount}
                </Tag>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <DropdownButton
                disabled={dependentsCount === 0}
                onClick={() => onDependentsShow(pkg)}
              >
                Show all
              </DropdownButton>
              <DropdownButton
                disabled={dependentsCount === 0}
                onClick={() => onDependentsHide(pkg)}
              >
                Hide all
              </DropdownButton>
            </div>
          </div>
          <div className="grid gap-2">
            <div className="flex items-center gap-1">
              <ArrowDown className="h-4 w-4" />
              <Text className="font-medium text-foreground">Dependencies</Text>
              <div className="grow text-right">
                <Tag use="outline" className="text-xs">
                  {dependenciesCount}
                </Tag>
              </div>
            </div>
            <div className="flex gap-1">
              <DropdownButton
                disabled={dependenciesCount === 0}
                onClick={() => onDependenciesShow(pkg)}
              >
                Show all
              </DropdownButton>
              <DropdownButton
                disabled={dependenciesCount === 0}
                onClick={() => onDependenciesHide(pkg)}
              >
                Hide all
              </DropdownButton>
            </div>
          </div>
        </div>
      </div>
    </GraphTooltip>
  );
};
