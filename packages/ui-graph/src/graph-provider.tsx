'use client';
import { createActorContext } from '@xstate/react';
import { graphMachine } from './graph-machine';
import { ReactFlowProvider } from 'reactflow';

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
      <ReactFlowProvider>{children}</ReactFlowProvider>
    </GraphContext.Provider>
  );
};

export default GraphProvider;
