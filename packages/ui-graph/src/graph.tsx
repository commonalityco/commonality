'use client';
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
} from '@xyflow/react';
import { PackageNode } from './package-node';
import { DependencyEdge } from './package/dependency-edge';
import { DependencyEdgeData } from './package/get-edges';
import { GradientFade } from '@commonalityco/ui-core';
import { PackageNodeData } from './package/get-nodes';

const nodeTypes = {
  package: PackageNode,
};

const edgeTypes = {
  dependency: DependencyEdge,
};

export const Graph = (
  props: {
    totalCount: number;
    nodes: Node[];
    edges: Edge[];
    theme: 'light' | 'dark';
    children?: React.ReactNode;

    controlBar?: React.ReactNode;
  } & Pick<ComponentProps<typeof ReactFlow>, 'onSelectionChange'>,
) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(props.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(props.edges);

  const onNodeMouseLeave = useCallback(
    (event: React.MouseEvent, node: Node) => {
      setNodes((currentNodes: Node<PackageNodeData>[]) => {
        return currentNodes.map((currentNode) => {
          return {
            ...currentNode,
            muted: false,
          };
        });
      });

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

      setNodes((currentNodes: Node<PackageNodeData>[]) => {
        return currentNodes.map((currentNode) => {
          return currentNode.id === node.id
            ? {
                ...currentNode,
                muted: !neighbors.some((neighbor) => neighbor.id === node.id),
              }
            : currentNode;
        });
      });

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
          proOptions={{ hideAttribution: true }}
          edgeTypes={edgeTypes}
          connectionLineType={ConnectionLineType.SmoothStep}
          fitView
          className="bg-interactive"
        >
          {props.children}
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
          <MiniMap nodeStrokeWidth={3} className="z-20" position="top-right" />

          <Background
            className="bg-interactive"
            color={props.theme === 'light' ? '#71717a' : '#52525b'}
            variant={BackgroundVariant.Dots}
          />
        </ReactFlow>
      </div>
      {props.controlBar}
    </div>
  );
};
