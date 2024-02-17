'use client';
import React, {
  ComponentProps,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import ReactFlow, {
  ConnectionLineType,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  Position,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  getConnectedEdges,
  getOutgoers,
  getIncomers,
  ControlButton,
} from 'reactflow';
import dagre from 'dagre';
import { PackageNode } from './package-node';
import { DependencyEdge } from './package/dependency-edge';
import { DependencyEdgeData } from './package/get-edges';
import { PackageNodeData } from './package/get-nodes';
import { ArrowDownFromLine, ArrowRightFromLine } from 'lucide-react';
import { Separator } from '@commonalityco/ui-design-system';
import useAutoLayout from './use-auto-layout';

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeTypes = {
  package: PackageNode,
};

const edgeTypes = {
  dependency: DependencyEdge,
};

const getLayoutedElements = ({
  nodes,
  edges,
  direction = 'TB',
}: {
  nodes: Node[];
  edges: Edge[];
  direction?: 'TB' | 'LR';
}) => {
  const isHorizontal = direction === 'LR';

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

  return { nodes, edges };
};

export const Graph = (
  props: {
    nodes: Node[];
    edges: Edge[];
    theme: 'light' | 'dark';
    children?: React.ReactNode;
  } & Pick<ComponentProps<typeof ReactFlow>, 'onSelectionChange'>,
) => {
  const [direction, setDirection] = useState<'TB' | 'LR'>('TB');

  const { nodes: layoutedNodes, edges: layoutedEdges } = useMemo(
    () =>
      getLayoutedElements({
        nodes: props.nodes,
        edges: props.edges,
        direction,
      }),
    [props.nodes, props.edges, direction],
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);

  // useAutoLayout({ direction, spacing: [50, 200] });

  useEffect(() => {
    setNodes(() => layoutedNodes);
  }, [props.nodes, setNodes]);

  const onNodeMouseLeave = useCallback(
    (event: React.MouseEvent, node: Node) => {
      // const connectedEdges = getConnectedEdges([node], edges);

      setNodes((currentNodes: Node<PackageNodeData>[]) =>
        currentNodes.map((currentNode) => ({
          ...currentNode,
          data: {
            ...currentNode.data,
            muted: false,
          },
        })),
      );

      setEdges((currentEdges: Edge<DependencyEdgeData>[]) =>
        currentEdges.map((currentEdge) => {
          if (!currentEdge.data) return currentEdge;

          return {
            ...currentEdge,
            data: {
              ...currentEdge.data,
              active: false,
              muted: false,
            },
          };
        }),
      );
    },
    [edges, setNodes, setEdges],
  );

  const onNodeMouseEnter = useCallback(
    (event: React.MouseEvent, node: Node) => {
      const connectedEdges = getConnectedEdges([node], edges);
      const outgoers = getOutgoers(node, nodes, edges);
      const incomers = getIncomers(node, nodes, edges);
      const neighbors = [node, ...outgoers, ...incomers];

      setNodes((currentNodes: Node<PackageNodeData>[]) =>
        currentNodes.map((currentNode) => ({
          ...currentNode,
          data: {
            ...currentNode.data,
            muted: !neighbors.some(
              (neighbor) => neighbor.id === currentNode.id,
            ),
          },
        })),
      );

      setEdges((currentEdges: Edge<DependencyEdgeData>[]) =>
        currentEdges.map((currentEdge) => {
          if (!currentEdge.data) return currentEdge;

          const isActive = connectedEdges.some(
            (edge) => edge.id === currentEdge.id,
          );

          return {
            ...currentEdge,
            data: {
              ...currentEdge.data,
              active: isActive,
              muted: !isActive,
            },
          };
        }),
      );
    },
    [edges, nodes],
  );

  const onEdgeMouseLeave = useCallback(
    (event: React.MouseEvent, edge: Edge<DependencyEdgeData>) => {
      setEdges((currentEdges) =>
        currentEdges.map((currentEdge: Edge<DependencyEdgeData>) => {
          if (!currentEdge.data) {
            return currentEdge;
          } else if (currentEdge.id === edge.id) {
            return {
              ...currentEdge,
              data: {
                ...currentEdge.data,
                active: false,
              },
            };
          } else {
            return currentEdge;
          }
        }),
      );
    },
    [],
  );

  const onEdgeMouseEnter = useCallback(
    (event: React.MouseEvent, edge: Edge<DependencyEdgeData>) => {
      setEdges((currentEdges) =>
        currentEdges.map((currentEdge: Edge<DependencyEdgeData>) => {
          if (!currentEdge.data) return currentEdge;

          return currentEdge.id === edge.id
            ? {
                ...currentEdge,
                data: {
                  ...currentEdge.data,
                  active: true,
                },
              }
            : currentEdge;
        }),
      );
    },
    [],
  );

  const onLayout = useCallback(
    (direction: 'TB' | 'LR') => {
      const { nodes: layoutedNodes, edges: layoutedEdges } =
        getLayoutedElements({ nodes, edges, direction });

      setNodes([...layoutedNodes]);
      setEdges([...layoutedEdges]);

      setDirection(direction);
    },
    [nodes, edges],
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      minZoom={0.1}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onNodeMouseEnter={onNodeMouseEnter}
      onNodeMouseLeave={onNodeMouseLeave}
      onEdgeMouseEnter={onEdgeMouseEnter}
      onEdgeMouseLeave={onEdgeMouseLeave}
      onSelectionChange={props.onSelectionChange}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      connectionLineType={ConnectionLineType.SmoothStep}
      fitView
      className="bg-interactive"
    >
      {props.children}
      <Controls showInteractive={false}>
        <Separator orientation="vertical" className="h-6 my-1" />
        <ControlButton onClick={() => onLayout('TB')}>
          <ArrowDownFromLine className="h-4 w-4" />
        </ControlButton>
        <ControlButton onClick={() => onLayout('LR')}>
          <ArrowRightFromLine className="h-4 w-4" />
        </ControlButton>
      </Controls>
      <MiniMap nodeStrokeWidth={3} />

      <Background
        className="bg-interactive"
        color={props.theme === 'light' ? '#71717a' : '#52525b'}
        variant={BackgroundVariant.Dots}
      />
    </ReactFlow>
  );
};
