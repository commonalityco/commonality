'use client';

import { GraphProvider } from '@commonalityco/feature-graph';
import { ComponentProps } from 'react';

export function StudioGraphProvider(
  props: Omit<ComponentProps<typeof GraphProvider>, 'worker'>
) {
  return (
    <GraphProvider
      dehydratedState={props.dehydratedState}
      worker={new Worker(new URL('./worker.ts', import.meta.url))}
    >
      {props.children}
    </GraphProvider>
  );
}
