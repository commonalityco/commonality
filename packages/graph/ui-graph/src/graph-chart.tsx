'use client';
import { forwardRef, memo } from 'react';
import { GradientFade } from '@commonalityco/ui-core';
import clsx from 'clsx';
import { Loader2, PackageSearch } from 'lucide-react';
import { Button, cn } from '@commonalityco/ui-design-system';

interface GraphChartProperties {
  stripScopeFromPackageNames?: boolean;
  loading?: boolean;
  children?: React.ReactNode;
  isEmpty?: boolean;
  onShowAllPackages?: () => void;
}

export const GraphChart = memo(
  forwardRef<HTMLDivElement, GraphChartProperties>(
    ({ loading, children, isEmpty, onShowAllPackages }, ref) => {
      return (
        <div className="relative z-10 w-full shrink-0 grow">
          <div
            className={cn(
              'absolute bottom-0 left-0 right-0 top-0 z-20 flex h-full w-full items-center justify-center bg-background transition-opacity',
              {
                'opacity-100': isEmpty,
                'pointer-events-none -z-10 opacity-0': !isEmpty,
              }
            )}
          >
            <div className="text-center">
              <PackageSearch className="mx-auto h-8 w-8" />
              <p className="my-4">No packages match your filters</p>
              <Button onClick={onShowAllPackages}>Show all packages</Button>
            </div>
          </div>
          <GradientFade
            placement="top"
            className="absolute left-0 right-0 z-20 h-10"
          />
          <GradientFade
            placement="bottom"
            className="absolute left-0 right-0 z-20 h-10"
          />
          <GradientFade
            placement="left"
            className="absolute bottom-0 top-0 z-20 w-10"
          />
          <GradientFade
            placement="right"
            className="absolute bottom-0 top-0 z-20 w-10"
          />

          <div
            className={clsx(
              'absolute left-0 top-0 flex h-full w-full items-center justify-center',
              {
                'opacity-100': loading,
                'opacity-0 transition-opacity': !loading,
              }
            )}
          >
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
          <div
            id="graph-container"
            ref={ref}
            className={clsx(
              'h-full w-full cursor-grab active:cursor-grabbing',
              {
                'opacity-0': loading,
                'opacity-100 transition-opacity ': !loading,
              }
            )}
          />
          {children}
        </div>
      );
    }
  )
);
