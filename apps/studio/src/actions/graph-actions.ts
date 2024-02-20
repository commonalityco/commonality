'use server';
import { getElementsWithLayout } from '@commonalityco/ui-graph';
import { Edge, Node } from '@xyflow/react';
import SuperJSON from 'superjson';

export const getElementString = async ({
  nodes,
  edges,
  direction = 'TB',
}: {
  nodes: Node[];
  edges: Edge[];
  direction?: 'TB' | 'LR';
}): Promise<string> => {
  return SuperJSON.stringify(
    getElementsWithLayout({ nodes, edges, direction }),
  );
};
