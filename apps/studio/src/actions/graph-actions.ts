'use server';
import { GraphDirection, getElementsWithLayout } from '@commonalityco/ui-graph';
import { Edge, Node } from '@xyflow/react';

export const getElements = async ({
  nodes,
  edges,
  direction,
}: {
  nodes: Node[];
  edges: Edge[];
  direction?: GraphDirection;
}): Promise<{ nodes: Node[]; edges: Edge[] }> => {
  return getElementsWithLayout({ nodes, edges, direction });
};
