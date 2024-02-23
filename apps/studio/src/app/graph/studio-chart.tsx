'use client';
import { PackageToolbar } from '@commonalityco/ui-graph/package/package-toolbar';
import { Graph } from '@commonalityco/ui-graph/graph';
import { PackageNodeData } from '@commonalityco/ui-graph/package/get-nodes';
import { DependencyEdgeData } from '@commonalityco/ui-graph/package/get-edges';
import {
  EditTagsDialog,
  EditTagsDialogContent,
} from '@/components/edit-tags-dialog';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import {
  activeDependencyAtom,
  editingPackageAtom,
  isGraphLoadingAtom,
  selectedPackagesAtom,
} from '@/atoms/graph';
import {
  ConstraintResult,
  Dependency,
  Package,
  TagsData,
} from '@commonalityco/types';
import { Edge, Node, OnSelectionChangeParams } from '@xyflow/react';
import { Suspense, useCallback } from 'react';
import {
  ControlBar,
  GraphDirection,
  GraphLoading,
} from '@commonalityco/ui-graph';
import { useDirectionQuery, usePackagesQuery } from './graph-hooks';
import { DependencyConstraintsDialog } from '@commonalityco/ui-constraints';
import { AnimatePresence, motion } from 'framer-motion';
import { MonitorPlayIcon } from 'lucide-react';

function PackageEditTagsDialog({ tagsData }: { tagsData: TagsData[] }) {
  const [editingPackage, setEditingPackage] = useAtom(editingPackageAtom);

  const uniqueTags = Array.from(
    new Set(tagsData.flatMap((pkg) => pkg.tags)),
  ).sort();
  const tagsForPackage =
    tagsData.find((data) => data.packageName === editingPackage?.name)?.tags ??
    [];

  return (
    <EditTagsDialog
      open={Boolean(editingPackage)}
      onOpenChange={(open) => {
        if (!open) {
          setEditingPackage(null);
        }
      }}
    >
      {editingPackage ? (
        <EditTagsDialogContent
          pkg={editingPackage}
          existingTags={tagsForPackage}
          tags={uniqueTags}
          onEdit={() => setEditingPackage(null)}
        />
      ) : null}
    </EditTagsDialog>
  );
}

function ActiveDependencyDialog({
  dependencies,
  results,
}: {
  dependencies: Dependency[];
  results: ConstraintResult[];
}) {
  const [activeDependency, setActiveDependency] = useAtom(activeDependencyAtom);

  return (
    <EditTagsDialog
      open={Boolean(activeDependency)}
      onOpenChange={(open) => {
        if (!open) {
          setActiveDependency(null);
        }
      }}
    >
      {activeDependency ? (
        <DependencyConstraintsDialog
          dependencies={dependencies}
          results={results}
        />
      ) : null}
    </EditTagsDialog>
  );
}

function StudioPackageToolbar({
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
      debugger;
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

function StudioControlBar({
  shownCount,
  totalCount,
}: {
  shownCount: number;
  totalCount: number;
}) {
  const { setDirectionQuery } = useDirectionQuery();

  const onDirectionChange = useCallback(
    (direction: GraphDirection) => {
      setDirectionQuery(direction);
    },
    [setDirectionQuery],
  );

  return (
    <ControlBar
      onDirectionChange={onDirectionChange}
      shownCount={shownCount}
      totalCount={totalCount}
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
  dependencies,
  results,
}: {
  allNodes: Node<PackageNodeData>[];
  allEdges: Edge<DependencyEdgeData>[];
  shownNodes: Node<PackageNodeData>[];
  shownEdges: Edge<DependencyEdgeData>[];
  packages: Package[];
  dependencies: Dependency[];
  results: ConstraintResult[];
  tagsData: TagsData[];
  theme: 'light' | 'dark';
}) {
  const setSelectedPackages = useSetAtom(selectedPackagesAtom);
  const isLoading = useAtomValue(isGraphLoadingAtom);

  const onSelectionChange = useCallback(
    ({ nodes }: OnSelectionChangeParams) => {
      const selectedPackages = nodes
        .map((node) => packages.find((pkg) => pkg.name === node.id))
        .filter(Boolean) as Package[];

      setSelectedPackages(selectedPackages);
    },
    [setSelectedPackages, packages],
  );

  return (
    <AnimatePresence>
      {isLoading ? (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <GraphLoading />
        </motion.div>
      ) : (
        <>
          <PackageEditTagsDialog tagsData={tagsData} />
          <ActiveDependencyDialog
            dependencies={dependencies}
            results={results}
          />
          <Graph
            controlBar={
              <StudioControlBar
                shownCount={shownNodes.length}
                totalCount={allNodes.length}
              />
            }
            totalCount={0}
            nodes={shownNodes}
            edges={shownEdges}
            theme={theme}
            onSelectionChange={onSelectionChange}
          >
            <Suspense>
              <StudioPackageToolbar
                packages={packages}
                allEdges={allEdges}
                allNodes={allNodes}
              />
            </Suspense>
          </Graph>
        </>
      )}
    </AnimatePresence>
  );
}

export default StudioChart;
