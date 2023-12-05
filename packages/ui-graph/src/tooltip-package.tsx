/* eslint-disable @typescript-eslint/no-empty-function */
'use client';
import { Package } from '@commonalityco/types';
import { Button, Badge, Separator } from '@commonalityco/ui-design-system';
import { ComponentProps } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

export interface TooltipPackageProperties {
  onHide?: (package_: Package) => void;
  onFocus?: (package_: Package) => void;
  onEditTags: (package_: Package) => void;
  onDependenciesShow?: (package_: Package) => void;
  onDependenciesHide?: (package_: Package) => void;
  onDependentsShow?: (package_: Package) => void;
  onDependentsHide?: (package_: Package) => void;
  pkg: Package;
  dependentsCount: number;
  dependenciesCount: number;
}

function DropdownButton({
  children,
  ...restProperties
}: ComponentProps<typeof Button>) {
  return (
    <Button
      {...restProperties}
      variant="ghost"
      size="sm"
      className="w-full justify-start text-left text-sm px-2 last:mb-0 font-normal text-foreground"
    >
      {children}
    </Button>
  );
}

export const TooltipPackage = ({
  onHide = () => {},
  onFocus = () => {},
  onEditTags = () => {},
  onDependenciesShow = () => {},
  onDependenciesHide = () => {},
  onDependentsShow = () => {},
  onDependentsHide = () => {},
  dependenciesCount,
  dependentsCount,
  pkg,
}: TooltipPackageProperties) => {
  return (
    <>
      <div className="bg-background z-20 flex max-w-fit flex-nowrap rounded-md p-1 font-sans">
        <div className="w-48">
          <div>
            <div className="text-foreground px-2 py-1.5 text-sm font-semibold">
              Package
            </div>
            <DropdownButton onClick={() => onEditTags(pkg)}>
              Edit tags
            </DropdownButton>
            <DropdownButton onClick={() => onFocus(pkg)}>
              Isolate
            </DropdownButton>
            <DropdownButton onClick={() => onHide(pkg)}>Hide</DropdownButton>
          </div>
          <Separator className="my-1 w-full" />
          <div>
            <div className="flex items-center gap-1 px-2 py-1.5">
              <div className="text-foreground text-sm font-semibold">
                Dependents
              </div>
              <div className="grow text-right">
                <Badge
                  variant="secondary"
                  className="text-xs gap-px text-muted-foreground"
                >
                  {dependentsCount}
                  <ArrowUp className="h-3 w-3" />
                </Badge>
              </div>
            </div>

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
          <Separator className="my-1 w-full" />
          <div>
            <div className="flex items-center gap-1 px-2 py-1.5">
              <div className="text-foreground text-sm font-semibold">
                Dependencies
              </div>
              <div className="grow text-right">
                <Badge
                  variant="secondary"
                  className="text-xs gap-1 text-muted-foreground"
                >
                  {dependenciesCount}
                  <ArrowDown className="h-3 w-3" />
                </Badge>
              </div>
            </div>

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
    </>
  );
};
