'use client';
import { GraphChart, GraphLayoutMain } from '@commonalityco/ui-graph';
import {
  dependenciesKeys,
  getElementDefinitions,
  packagesKeys,
  violationsKeys,
} from '@commonalityco/utils-graph';
import { useEffect, useRef } from 'react';
import { PackageManager } from '@commonalityco/utils-core';
import {
  Dependency,
  Package,
  ProjectConfig,
  Violation,
} from '@commonalityco/types';
import { GraphContext } from './graph-provider';
import { FeatureGraphToolbar } from './feature-graph-toolbar';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@commonalityco/ui-design-system';
import debounce from 'lodash.debounce';

interface GraphProps {
  theme?: string;
  packageManager?: PackageManager;
  getPackages: () => Promise<Package[]>;
  getViolations: () => Promise<Violation[]>;
  getProjectConfig: () => Promise<ProjectConfig>;
  getDependencies: () => Promise<Dependency[]>;
}

export function FeatureGraph({
  theme,
  packageManager,
  getViolations,
  getPackages,
  getProjectConfig,
  getDependencies,
}: GraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: packages } = useQuery({
    queryKey: packagesKeys,
    queryFn: () => getPackages(),
  });

  const { data: dependencies } = useQuery({
    queryKey: dependenciesKeys,
    queryFn: () => getDependencies(),
  });

  const { data: violations } = useQuery({
    queryKey: violationsKeys,
    queryFn: getViolations,
  });

  const actor = GraphContext.useActorRef();

  const isLoading = GraphContext.useSelector(
    (state) =>
      state.matches('updating') ||
      state.matches('rendering') ||
      state.matches('uninitialized')
  );

  const isEmpty = GraphContext.useSelector((state) => {
    return state.matches('success') && state.context.elements.length === 0;
  });

  const isHovering = GraphContext.useSelector(
    (state) => state.context.hoveredRenderNode
  );

  const renderGraph = GraphContext.useSelector(
    (state) => state.context.renderGraph
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

    if (containerRef.current && packages && dependencies) {
      actor.send({
        type: 'INITIALIZE',
        containerId: containerRef.current.id,
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

  return (
    <GraphLayoutMain>
      <FeatureGraphToolbar
        packageManager={packageManager}
        getProjectConfig={getProjectConfig}
        getPackages={getPackages}
        getViolations={getViolations}
        onPackageClick={(packageName) => {
          actor.send({ type: 'NODE_SELECT', packageName });
        }}
      />
      <GraphChart
        ref={containerRef}
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
    </GraphLayoutMain>
  );
}
