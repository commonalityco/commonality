import dagre from 'dagre';
import { Edge, Node } from '@xyflow/react';
import { Position } from '@xyflow/system';
import { GraphDirection } from './types';

export const getElementsWithLayout = ({
  nodes,
  edges,
  direction = GraphDirection.TopToBottom,
}: {
  nodes: Node[];
  edges: Edge[];
  direction?: GraphDirection;
}): { nodes: Node[]; edges: Edge[]; height?: number; width?: number } => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const isHorizontal = direction === GraphDirection.LeftToRight;

  dagreGraph.setGraph({
    rankdir: direction,
    nodesep: 50,
    ranksep: 200,
  });

  for (const node of nodes) {
    dagreGraph.setNode(node.id, { width: node.width, height: node.height });
  }

  for (const edge of edges) {
    dagreGraph.setEdge(edge.source, edge.target);
  }

  dagre.layout(dagreGraph);

  for (const node of nodes) {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = isHorizontal ? Position.Left : Position.Top;
    node.sourcePosition = isHorizontal ? Position.Right : Position.Bottom;

    // We are shifting the dagre node position (anchor=center center) to the top left
    // so it matches the React Flow node anchor point (top left).
    node.position = {
      x: nodeWithPosition.x - (node.width ?? 250) / 2,
      y: nodeWithPosition.y - (node.height ?? 100) / 2,
    };

    node;
    continue;
  }

  const graph = dagreGraph.graph();

  return {
    height: graph.height,
    width: graph.width,
    nodes,
    edges,
  };
};
