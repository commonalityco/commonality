'use client';
import { ComponentProps, useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { useQueryParams } from '@/hooks/use-query-params';
import { slugifyPackageName } from '@commonalityco/utils-core';
import {
  FeatureGraphChart,
  GraphChartLoading,
} from '@commonalityco/ui-constraints';

function StudioChart(
  props: Omit<
    ComponentProps<typeof FeatureGraphChart>,
    'onPackageClick' | 'worker'
  >,
) {
  const { resolvedTheme } = useTheme();
  const { setQuery } = useQueryParams();
  const [worker, setWorker] = useState<Worker | null>(null);

  useEffect(() => {
    const newWorker = new Worker(new URL('./worker.ts', import.meta.url));

    setWorker(newWorker);

    return () => newWorker.terminate();
  }, []);

  if (!worker) {
    return <GraphChartLoading />;
  }

  return (
    <FeatureGraphChart
      {...props}
      worker={worker}
      theme={resolvedTheme}
      onPackageClick={(packageName) =>
        setQuery('package', slugifyPackageName(packageName))
      }
    />
  );
}

export default StudioChart;
