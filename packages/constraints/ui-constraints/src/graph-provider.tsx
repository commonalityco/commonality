'use client';
import 'xstate';
import { createActorContext } from '@xstate/react';
import { graphMachine } from '@commonalityco/state-constraints';

export const GraphContext: ReturnType<
  typeof createActorContext<typeof graphMachine>
> = createActorContext(graphMachine);

export const GraphProvider = ({ children }: { children?: React.ReactNode }) => {
  return (
    <GraphContext.Provider
      options={{
        delays: {},
        guards: {},
        services: {},
        actions: {},
      }}
    >
      {children}
    </GraphContext.Provider>
  );
};

export default GraphProvider;
