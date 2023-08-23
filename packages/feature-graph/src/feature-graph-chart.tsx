'use client';
import { PackageManager } from '@commonalityco/utils-core/constants';
import {
  Constraint,
  Dependency,
  Package,
  Violation,
} from '@commonalityco/types';
import { Package as PackageIcon } from 'lucide-react';
import { GraphChart } from '@commonalityco/ui-graph/graph-chart';
import { getElementDefinitions } from '@commonalityco/utils-graph/get-element-definitions';
import { useEffect, useRef } from 'react';
import { GraphContext } from './graph-provider.js';
import FeatureGraphToolbar from './feature-graph-toolbar.js';
import { cn } from '@commonalityco/ui-design-system/cn';
import debounce from 'lodash.debounce';
import { useTheme } from 'next-themes';

interface GraphProperties {
  packageManager?: PackageManager;
  packages: Package[];
  violations: Violation[];
  constraints: Constraint[];
  dependencies: Dependency[];
}

export function FeatureGraphChart({
  packageManager,
  violations,
  packages,
  constraints,
  dependencies,
}: GraphProperties) {
  const containerReference = useRef<HTMLDivElement>(null);
  const { resolvedTheme: theme } = useTheme();
  const actor = GraphContext.useActorRef();
  const isLoading = GraphContext.useSelector(
    (state) =>
      state.matches('updating') ||
      state.matches('rendering') ||
      state.matches('uninitialized'),
  );
  const isEmpty = GraphContext.useSelector((state) => {
    return state.matches('success') && state.context.elements.length === 0;
  });
  const isHovering = GraphContext.useSelector(
    (state) => state.context.hoveredRenderNode,
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
    if (!violations || !packages) {
      return;
    }

    if (containerReference.current && packages && dependencies) {
      actor.send({
        type: 'INITIALIZE',
        containerId: containerReference.current.id,
        elements: getElementDefinitions({ packages, dependencies }),
        theme: theme ?? 'light',
        violations,
      });
    }

    return () => {
      actor.send({ type: 'DESTROY' });
    };
  }, [violations, packages]);

  useEffect(() => {
    if (!theme) return;

    actor.send({ type: 'SET_THEME', theme });
  }, [theme, actor.send]);

  const isZero = !packages?.length;

  if (isZero) {
    return (
      <div className="bg-background absolute bottom-0 left-0 right-0 top-0 z-30 flex h-full w-full items-center justify-center transition-opacity">
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
      <FeatureGraphToolbar
        packageManager={packageManager}
        constraints={constraints}
        packages={packages}
        violations={violations}
        onPackageClick={(packageName) => {
          actor.send({ type: 'NODE_SELECT', packageName });
        }}
      />
      <GraphChart
        ref={containerReference}
        loading={isLoading}
        isEmpty={isEmpty}
        className={cn({
          'cursor-pointer': isHovering,
          'cursor-grab active:cursor-grabbing': !isHovering,
        })}
        onShowAllPackages={() => {
          actor.send({ type: 'SHOW_ALL' });
        }}
      />
    </>
  );
}

export default FeatureGraphChart;
