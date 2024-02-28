'use client';
import {
  Edge,
  Node,
  OnSelectionChangeFunc,
  getConnectedEdges,
  getIncomers,
  getOutgoers,
  useReactFlow,
} from '@xyflow/react';

export function useInteractions<Data>({
  nodes,
  edges,
  onChange,
}: {
  nodes: Node<Data>[];
  edges: Edge[];
  onChange: OnSelectionChangeFunc;
}) {
  const { getNodes } = useReactFlow<Node<Data>, Edge>();

  return {
    hideAll: () => {
      onChange({ nodes: [], edges: [] });
    },
    showAll: () => {
      onChange({ nodes, edges });
    },
    show: (packageNames: string[]) => {
      const currentNodes = getNodes();

      const newNodes = nodes.filter((node) => packageNames.includes(node.id));

      const updatedNodes = [...currentNodes, ...newNodes];

      onChange({
        nodes: updatedNodes,
        edges: getConnectedEdges(updatedNodes, edges),
      });
    },
    focus: (packageNames: string[]) => {
      const selectedNodes = nodes.filter((node) =>
        packageNames.includes(node.id),
      );

      if (selectedNodes.length === 0) return;

      const incomers = selectedNodes.flatMap((selectedPkg) =>
        getIncomers(selectedPkg, nodes, edges),
      );

      const outgoers = selectedNodes.flatMap((selectedPkg) =>
        getOutgoers(selectedPkg, nodes, edges),
      );

      const neighbors = [...selectedNodes, ...incomers, ...outgoers];

      const newEdges = getConnectedEdges(neighbors, edges);

      onChange({ nodes: neighbors, edges: newEdges });
    },
    hide: (nodeIds: string[]) => {
      const newNodes = getNodes().filter((node) => !nodeIds.includes(node.id));

      onChange({
        nodes: newNodes,
        edges: getConnectedEdges(newNodes, edges),
      });
    },
  };
}
