'use client';
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
      <GraphInteractionProvider allNodes={allNodes} allEdges={allEdges}>
        {children}
      </GraphInteractionProvider>
    </ReactFlowProvider>
  );
}
