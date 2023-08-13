'use client';
import { forwardRef, memo } from 'react';
import { GradientFade } from '@commonalityco/ui-core';
import { Loader2, Package, PackageSearch } from 'lucide-react';
import { Button, cn } from '@commonalityco/ui-design-system';

interface GraphChartProperties {
  loading?: boolean;
  children?: React.ReactNode;
  isEmpty?: boolean;
  isZero?: boolean;
  onShowAllPackages?: () => void;
  className?: string;
}

export const GraphChart = memo(
  forwardRef<HTMLDivElement, GraphChartProperties>(
    (
      { loading, children, isEmpty, className, isZero, onShowAllPackages },
      ref
    ) => {
      return (
        <div className={cn('relative z-10 w-full shrink-0 grow', className)}>
          <div
            className={cn(
              'bg-background absolute bottom-0 left-0 right-0 top-0 z-30 flex h-full w-full items-center justify-center transition-opacity',
              {
                'opacity-100': isZero,
                'display-none opacity-0': !isZero,
              }
            )}
          >
            <div className="max-w-sm text-center">
              <Package className="mx-auto h-8 w-8" />
              <p className="mb-2 mt-4 text-base font-semibold">
                Build your first package
              </p>
              <p className="text-muted-foreground">
                You'll see your dependency graph here after you've created your
                first package.
              </p>
            </div>
          </div>
          <div
            className={cn(
              'bg-background absolute bottom-0 left-0 right-0 top-0 z-20 flex h-full w-full items-center justify-center transition-opacity',
              {
                'opacity-100': isEmpty,
                'display-none opacity-0': !isEmpty,
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
            className={cn(
              'absolute left-0 top-0 flex h-full w-full items-center justify-center',
              {
                'opacity-100': loading,
                'opacity-0 transition-opacity': !loading,
              }
            )}
          >
            <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
          </div>
          <div
            id="graph-container"
            ref={ref}
            className={cn('h-full w-full', {
              'opacity-0': loading,
              'opacity-100 transition-opacity ': !loading,
            })}
          />
          {children}
        </div>
      );
    }
  )
);
