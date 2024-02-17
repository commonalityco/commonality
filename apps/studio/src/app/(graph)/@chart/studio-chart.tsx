'use client';
import { ComponentProps, useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { FeatureGraphChart, ChartLoading } from '@commonalityco/ui-constraints';
import { PackageToolbar } from '@commonalityco/ui-graph/package/package-toolbar';
import { Graph } from '@commonalityco/ui-graph/graph';
import { getNodes } from '@commonalityco/ui-graph/package/get-nodes';
import { getEdges } from '@commonalityco/ui-graph/package/get-edges';
import {
  EditTagsDialog,
  EditTagsDialogContent,
} from '@/components/edit-tags-dialog';
import { useAtom, useSetAtom } from 'jotai';
import { editingPackageAtom, selectedPackagesAtom } from '@/atoms/graph';
import { Package, TagsData } from '@commonalityco/types';

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

function StudioPackageToolbar({ packages }: { packages: Package[] }) {
  const [selectedPackages] = useAtom(selectedPackagesAtom);
  const setEditingPackage = useSetAtom(editingPackageAtom);

  return (
    <PackageToolbar
      nodeIds={selectedPackages.map((node) => node.name)}
      onEditTags={(packageName) => {
        const selectedPkg = packages.find((pkg) => pkg.name === packageName);

        if (!selectedPkg) return;

        setEditingPackage(selectedPkg);
      }}
    />
  );
}

function StudioChart(
  props: Omit<
    ComponentProps<typeof FeatureGraphChart>,
    'onPackageClick' | 'worker'
  >,
) {
  const setSelectedPackages = useSetAtom(selectedPackagesAtom);
  const { resolvedTheme } = useTheme();

  const [worker, setWorker] = useState<Worker | null>(null);

  useEffect(() => {
    const newWorker = new Worker(new URL('./worker.ts', import.meta.url));

    setWorker(newWorker);

    return () => newWorker.terminate();
  }, []);

  if (!worker) {
    return <ChartLoading />;
  }

  const nodes = getNodes({
    dependencies: props.dependencies,
    packages: props.packages,
    tagsData: props.tagsData,
    codeownersData: [],
  });
  const edges = getEdges({
    dependencies: props.dependencies,
    packages: props.packages,
    theme: (resolvedTheme as 'light' | 'dark') ?? 'light',
  });

  return (
    <>
      <PackageEditTagsDialog tagsData={props.tagsData} />
      <Graph
        nodes={nodes}
        edges={edges}
        theme={(resolvedTheme as 'light' | 'dark') ?? 'light'}
        onSelectionChange={({ nodes }) => {
          setSelectedPackages(
            props.packages.filter((pkg) =>
              nodes.some((node) => node.id === pkg.name),
            ),
          );
        }}
      >
        <StudioPackageToolbar packages={props.packages} />
      </Graph>
    </>
  );
}

export default StudioChart;
