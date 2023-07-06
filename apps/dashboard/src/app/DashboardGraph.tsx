'use client';
import {
  CodeownersData,
  DocumentsData,
  Package,
  ProjectConfig,
  Violation,
} from '@commonalityco/types';
import { PackageManager } from '@commonalityco/utils-core';
import React, { ComponentProps } from 'react';
import { useTheme } from 'next-themes';
import { getUpdatedGraphJsonAction } from 'actions/graph';
import { FeatureGraph } from '@commonalityco/feature-graph';
import { setTagsAction } from 'actions/metadata';

function DashboardGraph({
  packages,
  packageManager,
  violations,
  getTags,
  projectConfig,
  getViolations,
  documentsData,
  codeownersData,
}: {
  packages: Package[];
  violations: Violation[];
  packageManager: PackageManager;
  getTags: () => Promise<Array<{ packageName: string; tags: string[] }>>;
  getViolations: ComponentProps<typeof FeatureGraph>['getViolations'];
  projectConfig: ProjectConfig;
  documentsData: DocumentsData[];
  codeownersData: CodeownersData[];
}) {
  const { resolvedTheme } = useTheme();

  return (
    <FeatureGraph
      documentsData={documentsData}
      codeownersData={codeownersData}
      projectConfig={projectConfig}
      violations={violations}
      packages={packages}
      theme={resolvedTheme}
      getUpdatedGraphJson={getUpdatedGraphJsonAction}
      packageManager={packageManager}
      onSetTags={setTagsAction}
      getTags={getTags}
      getViolations={getViolations}
    />
  );
}

export default DashboardGraph;
