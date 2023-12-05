'use client';
import React from 'react';
import { forwardRef, memo } from 'react';
import { GradientFade } from '@commonalityco/ui-core';
import { Loader2, PackageSearch } from 'lucide-react';
import { Button, cn } from '@commonalityco/ui-design-system';

interface GraphChartProperties {
  loading?: boolean;
  children?: React.ReactNode;
  isEmpty?: boolean;
  onShowAllPackages?: () => void;
  className?: string;
}

export const GraphChart = memo(
  forwardRef<HTMLDivElement, GraphChartProperties>(
    (
      { loading, children, isEmpty, className, onShowAllPackages },
      reference,
    ) => {
      return (
        <div className={cn('relative z-10 w-full shrink-0 grow', className)}>
          <div
            className={cn(
              'bg-accent absolute bottom-0 left-0 right-0 top-0 z-20 flex h-full w-full items-center justify-center transition-opacity',
              {
                'opacity-100': isEmpty,
                'hidden opacity-0': !isEmpty,
              },
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
            className="absolute left-0 right-0 z-20 h-10 from-secondary dark:from-interactive"
          />
          <GradientFade
            placement="bottom"
            className="absolute left-0 right-0 z-20 h-10 from-secondary dark:from-interactive"
          />
          <GradientFade
            placement="left"
            className="absolute bottom-0 top-0 z-20 w-10 from-secondary dark:from-interactive"
          />
          <GradientFade
            placement="right"
            className="absolute bottom-0 top-0 z-20 w-10 from-secondary dark:from-interactive"
          />

          <div
            className={cn(
              'absolute left-0 top-0 flex h-full w-full items-center justify-center',
              {
                'opacity-100': loading,
                'opacity-0 transition-opacity': !loading,
              },
            )}
          >
            <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
          </div>
          <div
            id="graph-container"
            ref={reference}
            className={cn('bg-secondary dark:bg-interactive h-full w-full', {
              'opacity-0': loading,
              'opacity-100 transition-opacity ': !loading,
            })}
          />
          {children}
        </div>
      );
    },
  ),
);
