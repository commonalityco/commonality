'use client';
import { forwardRef, memo } from 'react';
import { GradientFade } from '@commonalityco/ui-core';
import clsx from 'clsx';
import { Loader2 } from 'lucide-react';

interface GraphChartProperties {
  stripScopeFromPackageNames?: boolean;
  loading?: boolean;
  children?: React.ReactNode;
}

export const GraphChart = memo(
  forwardRef<HTMLDivElement, GraphChartProperties>(
    ({ loading, children }, ref) => {
      return (
        <div className="relative z-10 w-full shrink-0 grow">
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
