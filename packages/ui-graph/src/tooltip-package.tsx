/* eslint-disable @typescript-eslint/no-empty-function */
'use client';
import React from 'react';
import { Package } from '@commonalityco/types';
import { Button, Text, Badge } from '@commonalityco/ui-design-system';
import type cytoscape from 'cytoscape';
import { ComponentProps } from 'react';
import { Package as PackageIcon, ArrowUp, ArrowDown } from 'lucide-react';
import { GraphTooltip } from './components/graph-tooltip.js';

export interface TooltipPackageProperties {
  onHide?: (package_: Package) => void;
  onFocus?: (package_: Package) => void;
  onDependenciesShow?: (package_: Package) => void;
  onDependenciesHide?: (package_: Package) => void;
  onDependentsShow?: (package_: Package) => void;
  onDependentsHide?: (package_: Package) => void;
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
}: TooltipPackageProperties) => {
  const package_: Package = renderNode.data();

  const dependentsCount = traversalNode.incomers().nodes().length;
  const dependenciesCount = traversalNode.outgoers().nodes().length;

  return (
    <GraphTooltip element={renderNode}>
      <div className="bg-background z-20 flex max-w-fit flex-nowrap rounded-md p-3 font-sans">
        <div className="grid w-48 auto-rows-min items-start gap-3">
          <div className="grid gap-2">
            <div className="flex items-center gap-1">
              <PackageIcon className="h-4 w-4" />
              <Text className="text-foreground font-medium">Package</Text>
            </div>
            <div className="flex flex-nowrap items-center gap-1">
              <DropdownButton onClick={() => onFocus(package_)}>
                Focus
              </DropdownButton>
              <DropdownButton onClick={() => onHide(package_)}>
                Hide
              </DropdownButton>
            </div>
          </div>
          <div className="grid gap-2">
            <div className="flex items-center gap-1">
              <ArrowUp className="h-4 w-4" />
              <Text className="text-foreground font-medium">Dependents</Text>
              <div className="grow text-right">
                <Badge variant="outline" className="text-xs">
                  {dependentsCount}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <DropdownButton
                disabled={dependentsCount === 0}
                onClick={() => onDependentsShow(package_)}
              >
                Show all
              </DropdownButton>
              <DropdownButton
                disabled={dependentsCount === 0}
                onClick={() => onDependentsHide(package_)}
              >
                Hide all
              </DropdownButton>
            </div>
          </div>
          <div className="grid gap-2">
            <div className="flex items-center gap-1">
              <ArrowDown className="h-4 w-4" />
              <Text className="text-foreground font-medium">Dependencies</Text>
              <div className="grow text-right">
                <Badge variant="outline" className="text-xs">
                  {dependenciesCount}
                </Badge>
              </div>
            </div>
            <div className="flex gap-1">
              <DropdownButton
                disabled={dependenciesCount === 0}
                onClick={() => onDependenciesShow(package_)}
              >
                Show all
              </DropdownButton>
              <DropdownButton
                disabled={dependenciesCount === 0}
                onClick={() => onDependenciesHide(package_)}
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
