'use client';
import { ComponentProps, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const GraphProvider = dynamic(
  () => import('@commonalityco/feature-graph/graph-provider'),
);

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
    return null;
  }

  return (
    <GraphProvider dehydratedState={props.dehydratedState} worker={worker}>
      {props.children}
    </GraphProvider>
  );
}

export default StudioGraphProvider;
