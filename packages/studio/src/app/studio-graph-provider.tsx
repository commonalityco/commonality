'use client';
import { GraphProvider } from '@commonalityco/feature-graph';
import { ComponentProps, useEffect, useState } from 'react';

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
    <GraphProvider
      dehydratedState={props.dehydratedState}
      worker={new Worker(new URL('./worker.ts', import.meta.url))}
    >
      {props.children}
    </GraphProvider>
  );
}
