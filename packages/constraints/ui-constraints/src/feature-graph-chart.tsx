'use client';
import { ConstraintResult, Dependency, Package } from '@commonalityco/types';
import { Package as PackageIcon } from 'lucide-react';
import { GraphChart } from './graph-chart';
import { useEffect, useRef } from 'react';
import { GraphContext } from './graph-provider';
import FeatureGraphToolbar from './feature-graph-toolbar';
import { cn } from '@commonalityco/ui-design-system/cn';
import debounce from 'lodash-es/debounce';
import { getElementDefinitions } from '@commonalityco/utils-constraints';
import { ProjectConfig } from '@commonalityco/utils-core';

interface GraphProperties {
  packages: Package[];
  results: ConstraintResult[];
  constraints: ProjectConfig['constraints'];
  dependencies: Dependency[];
  theme?: string;
  onPackageClick: (packageName: string) => void;
  worker: Worker;
}

export function FeatureGraphChart({
  packages,
  results,
  dependencies,
  theme,
  worker,
}: GraphProperties) {
  const containerReference = useRef<HTMLDivElement>(null);

  const actor = GraphContext.useActorRef();
  const isLoading = GraphContext.useSelector((state) => {
    return (
      state.matches('updating') ||
      state.matches('rendering') ||
      state.matches('uninitialized')
    );
  });

  const isEmpty = GraphContext.useSelector((state) => {
    return state.matches('success') && state.context.elements.length === 0;
  });
  const isHovering = GraphContext.useSelector(
    (state) => state.context.isHovering,
  );
  const renderGraph = GraphContext.useSelector(
    (state) => state.context.renderGraph,
  );

  useEffect(() => {
    const listener = debounce(() => {
      renderGraph?.resize();
      actor.send('FIT');
    }, 50);

    window.addEventListener('resize', listener);

    return () => window.removeEventListener('resize', listener);
  }, [renderGraph]);

  useEffect(() => {
    if (!results || !packages) {
      return;
    }

    if (containerReference.current && packages && dependencies && worker) {
      actor.send({
        type: 'INITIALIZE',
        containerId: containerReference.current.id,
        elements: getElementDefinitions({ packages, dependencies }),
        theme: theme ?? 'light',
        results,
        worker,
      });
    }

    return () => {
      actor.send({ type: 'DESTROY' });
    };
  }, [results, packages, worker]);

  useEffect(() => {
    if (!theme) return;

    actor.send({ type: 'SET_THEME', theme });
  }, [theme, actor.send]);

  const isZero = !packages?.length;

  if (isZero) {
    return (
      <div className="bg-accent absolute bottom-0 left-0 right-0 top-0 z-30 flex h-full w-full items-center justify-center transition-opacity">
        <div className="max-w-sm text-center">
          <PackageIcon className="mx-auto h-8 w-8" />
          <p className="mb-2 mt-4 text-base font-semibold">
            Build your first package
          </p>
          <p className="text-muted-foreground">
            You'll see your dependency graph here after you've created your
            first package.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <FeatureGraphToolbar />
      <GraphChart
        ref={containerReference}
        loading={isLoading}
        isEmpty={isEmpty}
        onShowAllPackages={() => {
          actor.send({ type: 'SHOW_ALL' });
        }}
        className={cn({
          'cursor-pointer': isHovering,
          'cursor-grab active:cursor-grabbing': !isHovering,
        })}
      />
    </>
  );
}

export default FeatureGraphChart;
