import {
  GraphLayoutAside,
  GraphLayoutMain,
  GraphLayoutRoot,
} from '@commonalityco/ui-constraints';
import React, { Suspense } from 'react';
import StudioSidebar from './studio-sidebar';
import { getTagsData } from '@/data/tags';
import { getPackagesData } from '@/data/packages';
import { getDependenciesData } from '@/data/dependencies';
import { getCodeownersData } from '@/data/codeowners';
import { getConstraintsData } from '@/data/constraints';
import { cookies } from 'next/headers';
import {
  GraphDirection,
  GraphLoading,
  getEdges,
  getNodes,
} from '@commonalityco/ui-graph';
import { getElements } from '@/actions/graph-actions';
import { getConnectedEdges } from '@xyflow/system';
import * as z from 'zod';
import { decompressFromEncodedURIComponent } from 'lz-string';
import {
  CodeownersData,
  ConstraintResult,
  Dependency,
  Package,
  TagsData,
} from '@commonalityco/types';
import { StudioGraphEmpty } from './studio-graph-empty';
import lazyLoad from 'next/dynamic';
import { StudioPackageToolbar } from './studio-package-toolbar';
import { StudioControlBar } from './studio-control-bar';
import { DependencyType } from '@commonalityco/utils-core';
import { parseAsArrayOf, parseAsStringEnum } from 'nuqs';

const StudioChart = lazyLoad(() => import('./studio-chart'), {
  ssr: false,
  loading: () => <GraphLoading />,
});

async function Sidebar({
  results,
  packages,
  tagsData,
  dependencies,
  codeownersData,
}: {
  packages: Package[];
  dependencies: Dependency[];
  tagsData: TagsData[];
  results: ConstraintResult[];
  codeownersData: CodeownersData[];
}) {
  const cookieStore = cookies();
  const defaultLayoutCookie = cookieStore.get('commonality:sidebar-layout');

  const getDefaultLayout = () => {
    try {
      if (defaultLayoutCookie) {
        const parsedLayout = JSON.parse(defaultLayoutCookie.value);
        const layoutSchema = z.union([
          z.tuple([z.number(), z.number(), z.number()]),
          z.undefined(),
        ]);
        return layoutSchema.parse(parsedLayout);
      }
    } catch (err) {
      return undefined;
    }
  };

  const defaultLayout = getDefaultLayout();

  return (
    <StudioSidebar
      results={results}
      tagsData={tagsData}
      codeownersData={codeownersData}
      dependencies={dependencies}
      packages={packages}
      defaultLayout={defaultLayout}
    />
  );
}

async function Graph({
  packages,
  dependencies,
  tagsData,
  filteredPackageNames,
  direction,
  results,
  activeDependencyTypes,
}: {
  packages: Package[];
  dependencies: Dependency[];
  tagsData: TagsData[];
  filteredPackageNames?: string[];
  direction: GraphDirection;
  results: ConstraintResult[];
  activeDependencyTypes: DependencyType[];
}) {
  const cookieStore = cookies();
  const defaultTheme = cookieStore.get('commonality:theme')?.value;

  const nodes = getNodes({
    packages,
    dependencies,
    tagsData,
  });

  const edges = getEdges({
    results,
    dependencies,
    theme: 'light',
    activeDependencyTypes,
  });

  const getShownElements = async () => {
    const filteredNodes =
      filteredPackageNames !== undefined
        ? nodes.filter((node) =>
            filteredPackageNames?.some((pkgName) => pkgName === node.id),
          )
        : nodes;

    const connectedEdges = getConnectedEdges(filteredNodes, edges);

    const elements = await getElements({
      nodes: filteredNodes,
      edges: connectedEdges,
      direction: direction,
    });

    return elements;
  };

  const shownElements = await getShownElements();

  if (shownElements.nodes.length === 0) {
    return <StudioGraphEmpty nodes={nodes} edges={edges} />;
  }

  return (
    <div className="flex flex-col h-full">
      <StudioPackageToolbar
        packages={packages}
        allEdges={edges}
        allNodes={nodes}
      />

      <StudioChart
        results={results}
        tagsData={tagsData}
        dependencies={dependencies}
        shownNodes={shownElements.nodes}
        shownEdges={shownElements.edges}
        theme={(defaultTheme as 'light' | 'dark') ?? 'light'}
        packages={packages}
      />

      <Suspense fallback={null}>
        <StudioControlBar
          shownCount={shownElements.nodes.length}
          totalCount={nodes.length}
        />
      </Suspense>
    </div>
  );
}

async function GraphPage({
  searchParams,
}: {
  searchParams?: {
    packages?: string;
    direction: GraphDirection;
    highlight: DependencyType[];
  };
}) {
  const [tagsData, packages, dependencies, results, codeownersData] =
    await Promise.all([
      getTagsData(),
      getPackagesData(),
      getDependenciesData(),
      getConstraintsData(),
      getCodeownersData(),
    ]);

  const getDecodedPackages = (): string[] | undefined => {
    if (!searchParams?.packages) return;

    try {
      return JSON.parse(
        decompressFromEncodedURIComponent(searchParams?.packages),
      );
    } catch (err) {
      return;
    }
  };

  const activeDependencyTypes = parseAsArrayOf(
    parseAsStringEnum<DependencyType>(Object.values(DependencyType)),
  ).parseServerSide(searchParams?.highlight);

  return (
    <GraphLayoutRoot>
      <GraphLayoutAside>
        <Sidebar
          packages={packages}
          dependencies={dependencies}
          tagsData={tagsData}
          codeownersData={codeownersData}
          results={results}
        />
      </GraphLayoutAside>
      <GraphLayoutMain>
        <Graph
          activeDependencyTypes={
            activeDependencyTypes ? activeDependencyTypes : []
          }
          results={results}
          direction={searchParams?.direction as GraphDirection}
          packages={packages}
          dependencies={dependencies}
          tagsData={tagsData}
          filteredPackageNames={getDecodedPackages()}
        />
      </GraphLayoutMain>
    </GraphLayoutRoot>
  );
}

export default GraphPage;
