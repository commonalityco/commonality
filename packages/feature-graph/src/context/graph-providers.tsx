'use client';
import { Provider as JotaiProvider } from 'jotai';
import { Edge, Node, ReactFlowProvider } from '@xyflow/react';
import { GraphInteractionProvider } from './interaction-context';

export function GraphProviders({
  children,
  allNodes,
  allEdges,
  defaultNodes,
  defaultEdges,
}: {
  children: React.ReactNode;
  allNodes: Node[];
  allEdges: Edge[];
  defaultNodes: Node[];
  defaultEdges: Edge[];
}) {
  return (
    <ReactFlowProvider
      initialNodes={defaultNodes}
      initialEdges={defaultEdges}
      defaultNodes={defaultNodes}
      defaultEdges={defaultEdges}
    >
      <JotaiProvider>
        <GraphInteractionProvider allNodes={allNodes} allEdges={allEdges}>
          {children}
        </GraphInteractionProvider>
      </JotaiProvider>
    </ReactFlowProvider>
  );
}
