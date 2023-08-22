'use client';
import { GraphChart, GraphLayoutMain } from '@commonalityco/ui-graph';
import {
  dependenciesKeys,
  packagesKeys,
  violationsKeys,
} from '@commonalityco/utils-graph/query-keys';
import { getElementDefinitions } from '@commonalityco/utils-graph';
import { useEffect, useRef } from 'react';
import { PackageManager } from '@commonalityco/utils-core';
import {
  Constraint,
  Dependency,
  Package,
  Violation,
} from '@commonalityco/types';
import { GraphContext } from './graph-provider.js';
import FeatureGraphToolbar from './feature-graph-toolbar.js';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@commonalityco/ui-design-system/cn';
import debounce from 'lodash.debounce';

interface GraphProperties {
  theme?: string;
  packageManager?: PackageManager;
  getPackages: () => Promise<Package[]>;
  getViolations: () => Promise<Violation[]>;
  getConstraints: () => Promise<Constraint[]>;
  getDependencies: () => Promise<Dependency[]>;
}

export function FeatureGraph({
  theme,
  packageManager,
  getViolations,
  getPackages,
  getConstraints,
  getDependencies,
}: GraphProperties) {
  const containerReference = useRef<HTMLDivElement>(null);

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
      state.matches('uninitialized'),
  );

  const isEmpty = GraphContext.useSelector((state) => {
    return state.matches('success') && state.context.elements.length === 0;
  });

  const isZero = !packages?.length;

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

  return (
    <GraphLayoutMain>
      <FeatureGraphToolbar
        packageManager={packageManager}
        getConstraints={getConstraints}
        getPackages={getPackages}
        getViolations={getViolations}
        onPackageClick={(packageName) => {
          actor.send({ type: 'NODE_SELECT', packageName });
        }}
      />
      <GraphChart
        ref={containerReference}
        loading={isLoading}
        isZero={isZero}
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

export default FeatureGraph;
