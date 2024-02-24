'use client';
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
import { useCallback } from 'react';
import { GraphLoading } from '@commonalityco/ui-graph';
import { DependencyConstraintsDialog } from '@commonalityco/ui-constraints';
import { AnimatePresence, motion } from 'framer-motion';

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

function StudioChart({
  shownEdges,
  shownNodes,
  tagsData,
  theme,
  packages,
  dependencies,
  results,
}: {
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
          transition={{ delay: 0.5, duration: 0.15 }}
        >
          <GraphLoading />
        </motion.div>
      ) : (
        <motion.div
          className="h-full w-full"
          key="graph"
          transition={{ duration: 0.15 }}
          initial={{ opacity: 0 }}
          exit={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <PackageEditTagsDialog tagsData={tagsData} />
          <ActiveDependencyDialog
            dependencies={dependencies}
            results={results}
          />
          <Graph
            totalCount={0}
            nodes={shownNodes}
            edges={shownEdges}
            theme={theme}
            onSelectionChange={onSelectionChange}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default StudioChart;
