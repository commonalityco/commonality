'use client';
import 'xstate';
import { useState } from 'react';
import { createActorContext } from '@xstate/react';
import { graphMachine } from '@commonalityco/data-graph';
import {
  QueryClient,
  QueryClientProvider,
  Hydrate,
  DehydratedState,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export const GraphContext: ReturnType<
  typeof createActorContext<typeof graphMachine>
> = createActorContext(graphMachine);

export const GraphProvider = ({
  children,
  dehydratedState,
  worker,
}: {
  children: React.ReactNode;
  dehydratedState: DehydratedState;
  worker: Worker;
}) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={dehydratedState}>
        <GraphContext.Provider options={{ context: { worker } }}>
          {children}
          <ReactQueryDevtools />
        </GraphContext.Provider>
      </Hydrate>
    </QueryClientProvider>
  );
};
