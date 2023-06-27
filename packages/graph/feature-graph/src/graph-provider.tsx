'use client';
import { createActorContext } from '@xstate/react';
import { graphMachine } from '@commonalityco/data-graph';
import type { State } from 'xstate';

export const GraphContext = createActorContext(graphMachine);

export const GraphProvider = ({ children }: { children: React.ReactNode }) => {
  return <GraphContext.Provider>{children}</GraphContext.Provider>;
};
