'use client';

import { Package } from '@commonalityco/types';
import {
  DependencyEdgeData,
  PackageNodeData,
  PackageToolbar,
} from '@commonalityco/ui-graph';
import { Node, Edge } from '@xyflow/react';
import { useAtom, useSetAtom } from 'jotai';
import { usePackagesQuery } from './graph-hooks';
import { useCallback } from 'react';
import { editingPackageAtom, selectedPackagesAtom } from '@/atoms/graph';

export function StudioPackageToolbar({
  packages,
  allNodes,
  allEdges,
}: {
  packages: Package[];
  allNodes: Node<PackageNodeData>[];
  allEdges: Edge<DependencyEdgeData>[];
}) {
  const [selectedPackages] = useAtom(selectedPackagesAtom);
  const setEditingPackage = useSetAtom(editingPackageAtom);
  const { setPackagesQuery } = usePackagesQuery();

  const onNodesChange = useCallback(
    ({ nodes }: { nodes: Node<PackageNodeData>[] }) => {
      setPackagesQuery(nodes.map((node) => node.id));
    },
    [setPackagesQuery],
  );

  return (
    <PackageToolbar
      onChange={onNodesChange}
      nodes={allNodes}
      edges={allEdges}
      selectedNodeIds={selectedPackages.map((pkg) => pkg.name)}
      onEditTags={(packageName) => {
        const selectedPkg = packages.find((pkg) => pkg.name === packageName);

        if (!selectedPkg) return;

        setEditingPackage(selectedPkg);
      }}
    />
  );
}