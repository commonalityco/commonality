'use client';
import { ComponentProps, useEffect, useState } from 'react';
import {
  FeatureGraphLayout,
  FeatureGraphLoading,
  FeatureGraphSidebarLoading,
  GraphProvider,
} from '@commonalityco/feature-graph';

export function StudioGraphProvider(
  props: Omit<ComponentProps<typeof GraphProvider>, 'worker'>,
) {
  const [worker, setWorker] = useState<Worker | null>(null);

  useEffect(() => {
    const newWorker = new Worker(new URL('./worker.ts', import.meta.url));

    setWorker(newWorker);

    return () => newWorker.terminate();
  }, []);

  if (!worker) {
    return (
      <FeatureGraphLayout>
        <FeatureGraphSidebarLoading />
        <FeatureGraphLoading />
      </FeatureGraphLayout>
    );
  }

  return <GraphProvider worker={worker}>{props.children}</GraphProvider>;
}

export default StudioGraphProvider;
