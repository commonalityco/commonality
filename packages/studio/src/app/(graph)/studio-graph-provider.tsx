'use client';
import { ComponentProps, useEffect, useState } from 'react';
import { GraphProvider } from '@commonalityco/feature-graph/graph-provider';
import { FeatureGraphLayout } from '@commonalityco/feature-graph/feature-graph-layout';
import { FeatureGraphChartLoading } from '@commonalityco/feature-graph/feature-graph-chart-loading';
import { FeatureGraphChartLayout } from '@commonalityco/feature-graph/feature-graph-chart-layout';
import { FeatureGraphSidebarLoading } from '@commonalityco/feature-graph/feature-graph-sidebar-loading';
import { useQueryParams } from 'hooks/use-query-params';
import { slugifyPackageName } from '@commonalityco/utils-core';

export function StudioGraphProvider(
  props: Omit<
    ComponentProps<typeof GraphProvider>,
    'worker' | 'onPackageClick'
  >,
) {
  const [worker, setWorker] = useState<Worker | null>(null);
  const { setQuery } = useQueryParams();

  useEffect(() => {
    const newWorker = new Worker(new URL('./worker.ts', import.meta.url));

    setWorker(newWorker);

    return () => newWorker.terminate();
  }, []);

  if (!worker) {
    return (
      <FeatureGraphLayout>
        <FeatureGraphSidebarLoading />
        <FeatureGraphChartLayout>
          <FeatureGraphChartLoading />
        </FeatureGraphChartLayout>
      </FeatureGraphLayout>
    );
  }

  return (
    <GraphProvider
      worker={worker}
      onPackageClick={(packageName) => {
        setQuery('package', slugifyPackageName(packageName));
      }}
    >
      {props.children}
    </GraphProvider>
  );
}

export default StudioGraphProvider;
