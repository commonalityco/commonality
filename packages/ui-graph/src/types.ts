import { Edge, Node } from 'reactflow';

export type Direction = 'TB' | 'LR' | 'RL' | 'BT';

export type LayoutAlgorithmOptions = {
  direction: Direction;
  spacing: [number, number];
};

export type LayoutAlgorithm = (
  nodes: Node[],
  edges: Edge[],
  options: LayoutAlgorithmOptions,
) => Promise<{ nodes: Node[]; edges: Edge[] }>;
