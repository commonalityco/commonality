'use client';
import React from 'react';
import { Provider as JotaiProvider } from 'jotai';
import { ReactFlowProvider } from '@xyflow/react';

export function GraphProviders({ children }: { children: React.ReactNode }) {
  return (
    <ReactFlowProvider>
      <JotaiProvider>{children}</JotaiProvider>
    </ReactFlowProvider>
  );
}
