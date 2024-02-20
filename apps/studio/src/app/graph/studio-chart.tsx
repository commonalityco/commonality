'use client';
import { PackageToolbar } from '@commonalityco/ui-graph/package/package-toolbar';
import { Graph } from '@commonalityco/ui-graph/graph';
import { PackageNodeData } from '@commonalityco/ui-graph/package/get-nodes';
import { DependencyEdgeData } from '@commonalityco/ui-graph/package/get-edges';
import {
  EditTagsDialog,
  EditTagsDialogContent,
} from '@/components/edit-tags-dialog';
import { useAtom, useSetAtom } from 'jotai';
import { editingPackageAtom, selectedPackagesAtom } from '@/atoms/graph';
import { Package, TagsData } from '@commonalityco/types';
import {
  Edge,
  Node,
  OnSelectionChangeFunc,
  OnSelectionChangeParams,
} from '@xyflow/react';
import { getElementString } from '@/actions/graph-actions';
import SuperJSON from 'superjson';
import { useCallback } from 'react';
import { useOnInteraction } from './use-on-interaction';

function PackageEditTagsDialog({ tagsData }: { tagsData: TagsData[] }) {
  const [selectedPackage, setSelectedPackage] = useAtom(editingPackageAtom);
  const uniqueTags = Array.from(
    new Set(tagsData.flatMap((pkg) => pkg.tags)),
  ).sort();
  const tagsForPackage =
    tagsData.find((data) => data.packageName === selectedPackage?.name)?.tags ??
    [];

  return (
    <EditTagsDialog
      open={Boolean(selectedPackage)}
      onOpenChange={(open) => {
        if (!open) {
          setSelectedPackage(null);
        }
      }}
    >
      {selectedPackage ? (
        <EditTagsDialogContent
          pkg={selectedPackage}
          existingTags={tagsForPackage}
          tags={uniqueTags}
          onEdit={() => setSelectedPackage(null)}
        />
      ) : null}
    </EditTagsDialog>
  );
}

function StudioPackageToolbar({
  packages,
  allNodes,
  allEdges,
  onChange,
}: {
  packages: Package[];
  allNodes: Node<PackageNodeData>[];
  allEdges: Edge<DependencyEdgeData>[];
  onChange: OnSelectionChangeFunc;
}) {
  const [selectedPackages] = useAtom(selectedPackagesAtom);
  const setEditingPackage = useSetAtom(editingPackageAtom);

  return (
    <PackageToolbar
      onChange={onChange}
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

function StudioChart({
  shownEdges,
  shownNodes,
  allNodes,
  allEdges,
  tagsData,
  theme,
  packages,
}: {
  allNodes: Node<PackageNodeData>[];
  allEdges: Edge<DependencyEdgeData>[];
  shownNodes: Node<PackageNodeData>[];
  shownEdges: Edge<DependencyEdgeData>[];
  packages: Package[];
  tagsData: TagsData[];
  theme: 'light' | 'dark';
}) {
  const setSelectedPackages = useSetAtom(selectedPackagesAtom);

  const onSelectionChange = useCallback(
    ({ nodes }: OnSelectionChangeParams) => {
      const selectedPackages = nodes
        .map((node) => packages.find((pkg) => pkg.name === node.id))
        .filter(Boolean) as Package[];
      setSelectedPackages(selectedPackages);
    },
    [setSelectedPackages, packages],
  );

  const onInteraction = useOnInteraction();
  console.log('updated', shownNodes.length);
  return (
    <>
      <PackageEditTagsDialog tagsData={tagsData} />
      <Graph
        onInteraction={onInteraction}
        getElements={async () => {
          const elementString = await getElementString({
            nodes: shownNodes,
            edges: shownEdges,
          });

          return SuperJSON.parse(elementString);
        }}
        nodes={shownNodes}
        edges={shownEdges}
        theme={theme}
        onSelectionChange={onSelectionChange}
      >
        <StudioPackageToolbar
          packages={packages}
          allEdges={allEdges}
          allNodes={allNodes}
          onChange={onInteraction}
        />
      </Graph>
    </>
  );
}

export default StudioChart;
