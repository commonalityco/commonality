import { Edge, Node, ReactFlowJsonObject } from '@xyflow/react';
import { DependencyEdgeData } from './package/get-edges';
import { PackageNodeData } from './package/get-nodes';

export type Direction = 'TB' | 'LR' | 'RL' | 'BT';

export type LayoutAlgorithmOptions = {
  direction: Direction;
  spacing: [number, number];
};

export type LayoutAlgorithm = ({
  nodes,
  edges,
  options,
  height,
  width,
}: {
  nodes: Node<PackageNodeData>[];
  edges: Edge<DependencyEdgeData>[];
  options: LayoutAlgorithmOptions;
  height: number;
  width: number;
}) => Promise<{ nodes: Node[]; edges: Edge[] }>;

export type WorkerPayload = {
  graph: ReactFlowJsonObject;
  direction: 'TB' | 'LR';
};

export type WorkerResponse = ReactFlowJsonObject;
