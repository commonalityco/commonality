'use client';
import { Package, Violation } from '@commonalityco/types';
import { PackageManager } from '@commonalityco/utils-core';
import React from 'react';
import { useTheme } from 'next-themes';
import { getUpdatedGraphJsonAction } from 'actions/graph';
import { FeatureGraph } from '@commonalityco/feature-graph';
import { setTagsAction } from 'actions/metadata';

function DashboardGraph({
  packages,
  packageManager,
  allTags,
  violations,
}: {
  packages: Package[];
  violations: Violation[];
  packageManager: PackageManager;
  allTags: string[];
}) {
  const { resolvedTheme } = useTheme();

  return (
    <FeatureGraph
      violations={violations}
      allTags={allTags}
      packages={packages}
      theme={resolvedTheme}
      getUpdatedGraphJson={getUpdatedGraphJsonAction}
      packageManager={packageManager}
      onSetTags={setTagsAction}
    />
  );
}

export default DashboardGraph;
