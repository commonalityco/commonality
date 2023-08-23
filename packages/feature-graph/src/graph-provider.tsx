'use client';
import 'xstate';
import { createActorContext } from '@xstate/react';
import { graphMachine } from '@commonalityco/data-graph';

export const GraphContext: ReturnType<
  typeof createActorContext<typeof graphMachine>
> = createActorContext(graphMachine);

export const GraphProvider = ({
  children,
  worker,
}: {
  children?: React.ReactNode;
  worker: Worker;
}) => {
  return (
    <GraphContext.Provider
      options={{
        context: { worker },
        actions: {},
        delays: {},
        guards: {},
        services: {},
      }}
    >
      {children}
    </GraphContext.Provider>
  );
};

export default GraphProvider;
