import React, { ComponentProps, useCallback } from 'react';
import {
  ReactFlow,
  ConnectionLineType,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  Background,
  BackgroundVariant,
  MiniMap,
  getConnectedEdges,
  getOutgoers,
  getIncomers,
  useReactFlow,
  OnSelectionChangeFunc,
} from '@xyflow/react';
import dagre from 'dagre';
import { PackageNode } from './package-node';
import { DependencyEdge } from './package/dependency-edge';
import { DependencyEdgeData } from './package/get-edges';
import {
  ArrowDownFromLine,
  ArrowRightFromLine,
  Maximize,
  Minus,
  Plus,
} from 'lucide-react';
import { Button, Separator } from '@commonalityco/ui-design-system';
import { useInteractions } from './use-interactions';
import { GradientFade } from '@commonalityco/ui-core';

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeTypes = {
  package: PackageNode,
};

const edgeTypes = {
  dependency: DependencyEdge,
};

function ControlBar() {
  const reactFlow = useReactFlow();

  return (
    <div className="pb-3 px-3 relative w-full bg-interactive shrink-0 flex gap-1 justify-end">
      <Button size="icon" variant="ghost" onClick={() => {}}>
        <ArrowDownFromLine className="h-4 w-4" />
      </Button>
      <Button size="icon" variant="ghost" onClick={() => {}}>
        <ArrowRightFromLine className="h-4 w-4" />
      </Button>
      <Separator orientation="vertical" className="h-6 my-1 mx-2" />
      <Button
        size="icon"
        variant="ghost"
        onClick={() => reactFlow.fitView({ duration: 200 })}
      >
        <Maximize className="h-4 w-4" />
      </Button>

      <Button
        size="icon"
        variant="ghost"
        onClick={() => reactFlow.zoomOut({ duration: 200 })}
      >
        <Minus className="h-4 w-4" />
      </Button>
      <Button
        size="icon"
        variant="ghost"
        onClick={() => reactFlow.zoomIn({ duration: 200 })}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}

export const Graph = (
  props: {
    nodes: Node[];
    edges: Edge[];
    theme: 'light' | 'dark';
    children?: React.ReactNode;
    initialDirection?: 'TB' | 'LR';
    onInteraction: OnSelectionChangeFunc;
    getElements: (options: {
      nodes: Node[];
      edges: Edge[];
      direction: 'TB' | 'LR';
    }) => Promise<{
      nodes: Node[];
      edges: Edge[];
    }>;
  } & Pick<ComponentProps<typeof ReactFlow>, 'onSelectionChange'>,
) => {
  const { updateNodeData } = useReactFlow();

  const interactions = useInteractions({
    nodes: props.nodes,
    edges: props.edges,
    onChange: props.onInteraction ?? (() => {}),
  });

  const [nodes, setNodes, onNodesChange] = useNodesState(props.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(props.edges);

  // const { isLoading } = useLayout({
  //   direction: props.initialDirection,
  //   getElements: props.getElements,
  // });

  const onNodeMouseLeave = useCallback(
    (event: React.MouseEvent, node: Node) => {
      updateNodeData(node.id, (data) => ({
        ...data,
        muted: false,
      }));

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

      updateNodeData(node.id, (data) => ({
        ...data,
        muted: !neighbors.some((neighbor) => neighbor.id === node.id),
      }));

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

  return (
    <div className="relative flex flex-col h-full">
      <div className="relative grow w-full">
        <GradientFade
          placement="top"
          className="absolute left-0 right-0 z-20 h-10 from-interactive"
        />
        <GradientFade
          placement="bottom"
          className="absolute left-0 right-0 z-20 h-10 from-interactive"
        />
        <GradientFade
          placement="left"
          className="absolute bottom-0 top-0 z-20 w-10 from-interactive"
        />
        <GradientFade
          placement="right"
          className="absolute bottom-0 top-0 z-20 w-10 from-interactive"
        />
        <ReactFlow
          nodes={nodes}
          edges={edges}
          width={700}
          height={400}
          minZoom={0.1}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeMouseEnter={onNodeMouseEnter}
          onNodeMouseLeave={onNodeMouseLeave}
          onEdgeMouseEnter={onEdgeMouseEnter}
          onEdgeMouseLeave={onEdgeMouseLeave}
          onSelectionChange={props.onSelectionChange}
          nodeTypes={nodeTypes}
          proOptions={{ hideAttribution: true }}
          edgeTypes={edgeTypes}
          connectionLineType={ConnectionLineType.SmoothStep}
          fitView
          colorMode={props.theme}
          className="bg-interactive"
        >
          {props.children}

          <MiniMap nodeStrokeWidth={3} className="z-20" position="top-right" />

          <Background
            className="bg-interactive"
            color={props.theme === 'light' ? '#71717a' : '#52525b'}
            variant={BackgroundVariant.Dots}
          />
        </ReactFlow>
      </div>
      <ControlBar />
    </div>
  );
};
