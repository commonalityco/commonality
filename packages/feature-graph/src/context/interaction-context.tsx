'use client';
import React, { createContext, useContext, ReactNode } from 'react';
import { usePackagesQuery } from '../query/query-hooks';
import { PackageNodeData } from '../utilities/get-nodes';
import { DependencyEdgeData } from '../utilities/get-edges';
import { Node, Edge, getIncomers, getOutgoers } from '@xyflow/react';

interface InteractionContextType {
  hideAll: () => void;
  showAll: () => void;
  show: (packageNames: string[]) => void;
  focus: (packageNames: string[]) => void;
  hide: (packageNames: string[]) => void;
}

const GraphInteractionContext = createContext<
  InteractionContextType | undefined
>(undefined);

export function useInteractions() {
  const context = useContext(GraphInteractionContext);

  if (context === undefined) {
    throw new Error(
      'useInteractions must be used within a GraphInteractionProvider',
    );
  }

  return context;
}

interface GraphInteractionProviderProps {
  children: ReactNode;
  allNodes: Node<PackageNodeData>[];
  allEdges: Edge<DependencyEdgeData>[];
}

export const GraphInteractionProvider = ({
  children,
  allNodes,
  allEdges,
}: GraphInteractionProviderProps) => {
  const [packagesQuery, setPackagesQuery] = usePackagesQuery();
  const visibleNodes = packagesQuery
    ? allNodes.filter((node) => packagesQuery.includes(node.id))
    : allNodes;

  const interactions: InteractionContextType = {
    hideAll: () => setPackagesQuery([]),
    showAll: () => setPackagesQuery(allNodes.map((node) => node.id)),
    show: (packageNames: string[]) => {
      const newNodes = allNodes.filter((node) =>
        packageNames.includes(node.id),
      );

      setPackagesQuery([...visibleNodes, ...newNodes].map((node) => node.id));
    },
    focus: (packageNames: string[]) => {
      const selectedNodes = allNodes.filter((node) =>
        packageNames.includes(node.id),
      );

      if (selectedNodes.length === 0) return;

      const incomers = selectedNodes.flatMap((selectedPkg) =>
        getIncomers(selectedPkg, allNodes, allEdges),
      );

      const outgoers = selectedNodes.flatMap((selectedPkg) =>
        getOutgoers(selectedPkg, allNodes, allEdges),
      );

      setPackagesQuery(
        [...selectedNodes, ...incomers, ...outgoers].map((node) => node.id),
      );
    },
    hide: (packageNames: string[]) => {
      const newNodes = visibleNodes.filter(
        (node) => !packageNames.includes(node.id),
      );

      setPackagesQuery(newNodes.map((node) => node.id));
    },
  };

  return (
    <GraphInteractionContext.Provider value={interactions}>
      {children}
    </GraphInteractionContext.Provider>
  );
};
