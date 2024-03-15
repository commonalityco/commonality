'use client';
import { GradientFade } from '@commonalityco/ui-core';
import {
  Background,
  BackgroundVariant,
  ConnectionLineType,
  Edge,
  MiniMap,
  Node,
  OnSelectionChangeParams,
  ReactFlow,
  getConnectedEdges,
  getIncomers,
  getOutgoers,
  useEdgesState,
  useNodesState,
} from '@xyflow/react';
import React, { useCallback } from 'react';
import { PackageNode } from './package-node';
import { DependencyEdge } from './dependency-edge';
import { DependencyEdgeData } from '../utilities/get-edges';
import { PackageNodeData } from '../utilities/get-nodes';
import { useSetAtom } from 'jotai';
import {
  activeDependencyAtom,
  selectedPackagesAtom,
} from '../atoms/graph-atoms';
import { Dependency, Package } from '@commonalityco/types';

const nodeTypes = {
  package: PackageNode,
};

const edgeTypes = {
  dependency: DependencyEdge,
};

export const Graph = ({
  dependencies,
  packages,
  nodes,
  edges,
  theme,
}: {
  dependencies: Dependency[];
  packages: Package[];
  nodes: Node[];
  edges: Edge[];
  theme: 'light' | 'dark';
}) => {
  const [controlledNodes, setNodes, onNodesChange] = useNodesState(nodes);
  const [controlledEdges, setEdges, onEdgesChange] = useEdgesState(edges);

  const setSelectedPackages = useSetAtom(selectedPackagesAtom);
  const setActiveDependency = useSetAtom(activeDependencyAtom);

  const onSelectionChange = useCallback(
    ({ nodes }: OnSelectionChangeParams) => {
      const selectedPackages = nodes
        .map((node) => packages.find((pkg) => pkg.name === node.id))
        .filter(Boolean) as Package[];

      setSelectedPackages(selectedPackages);
    },
    [setSelectedPackages, packages],
  );

  const onNodeMouseLeave = useCallback(
    (_event: React.MouseEvent, _node: Node) => {
      setNodes((currentNodes) => {
        return currentNodes.map((currentNode) => {
          return {
            ...currentNode,
            muted: false,
          };
        });
      });

      setEdges((currentEdges) =>
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
    (_event: React.MouseEvent, node: Node) => {
      const connectedEdges = getConnectedEdges([node], edges);
      const outgoers = getOutgoers(node, nodes, edges);
      const incomers = getIncomers(node, nodes, edges);
      const neighbors = [node, ...outgoers, ...incomers];

      setNodes((currentNodes) => {
        return currentNodes.map((currentNode) => {
          return currentNode.id === node.id
            ? {
                ...currentNode,
                muted: !neighbors.some((neighbor) => neighbor.id === node.id),
              }
            : currentNode;
        });
      });

      setEdges((currentEdges) =>
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
    (_event: React.MouseEvent, edge: Edge) => {
      setEdges((currentEdges) =>
        currentEdges.map((currentEdge: Edge) => {
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
    (_event: React.MouseEvent, edge: Edge) => {
      setEdges((currentEdges) =>
        currentEdges.map((currentEdge) => {
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

  const onEdgeClick = useCallback(
    (event: React.MouseEvent<Element, MouseEvent>, edge: Edge) => {
      const depdendency = dependencies.find(
        (dep) => dep.source === edge.source && dep.target === edge.target,
      );

      if (!depdendency) return;

      setActiveDependency(depdendency);
    },
    [dependencies],
  );

  return (
    <div className="relative h-full grow" data-testid="dependency-graph">
      <div className="relative h-full w-full grow">
        <ReactFlow
          id="graph"
          nodes={controlledNodes}
          edges={controlledEdges}
          minZoom={0.1}
          onEdgeClick={onEdgeClick}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeMouseEnter={onNodeMouseEnter}
          onNodeMouseLeave={onNodeMouseLeave}
          onEdgeMouseEnter={onEdgeMouseEnter}
          onEdgeMouseLeave={onEdgeMouseLeave}
          onSelectionChange={onSelectionChange}
          nodeTypes={nodeTypes}
          proOptions={{ hideAttribution: true }}
          edgeTypes={edgeTypes}
          connectionLineType={ConnectionLineType.SmoothStep}
          fitView
          className="bg-secondary dark:bg-background"
        >
          <GradientFade
            placement="top"
            className="from-secondary dark:from-background absolute left-0 right-0 z-20 h-10"
          />
          <GradientFade
            placement="bottom"
            className="from-secondary dark:from-background absolute left-0 right-0 z-20 h-10"
          />
          <GradientFade
            placement="left"
            className="from-secondary dark:from-background absolute bottom-0 top-0 z-20 w-10"
          />
          <GradientFade
            placement="right"
            className="from-secondary dark:from-background absolute bottom-0 top-0 z-20 w-10"
          />
          <MiniMap
            nodeStrokeWidth={3}
            className="z-20 origin-top-right scale-50 md:scale-100"
            position="top-right"
          />

          <Background
            color={theme === 'light' ? '#71717a' : '#52525b'}
            variant={BackgroundVariant.Dots}
          />
        </ReactFlow>
      </div>
    </div>
  );
};
