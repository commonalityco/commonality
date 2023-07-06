'use client';
import { useState } from 'react';
import { createActorContext } from '@xstate/react';
import { graphMachine } from '@commonalityco/data-graph';
import {
  QueryClient,
  QueryClientProvider,
  Hydrate,
  DehydratedState,
} from '@tanstack/react-query';
import type { State } from 'xstate';

export const GraphContext = createActorContext(graphMachine);

export const GraphProvider = ({
  children,
  dehydratedState,
}: {
  children: React.ReactNode;
  dehydratedState: DehydratedState;
}) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={dehydratedState}>
        <GraphContext.Provider>{children}</GraphContext.Provider>
      </Hydrate>
    </QueryClientProvider>
  );
};
