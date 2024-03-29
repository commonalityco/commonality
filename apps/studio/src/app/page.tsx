import React, { Suspense } from 'react';
import { getTagsData } from '@/data/tags';
import { getPackagesData } from '@/data/packages';
import { getDependenciesData } from '@/data/dependencies';
import { getCodeownersData } from '@/data/codeowners';
import { getConstraintsData } from '@/data/constraints';
import { cookies } from 'next/headers';
import {
  GraphControlBar,
  GraphDirection,
  GraphFilterSidebar,
  GraphProviders,
  getEdges,
  getNodes,
  GraphLayoutLeftSidebar,
  GraphLayoutMain,
  GraphLayoutRoot,
  getElementsWithLayout,
  GraphEmpty,
  COOKIE_FILTER_SIDEBAR,
  GraphLayoutRightSidebar,
  GraphContextSidebar,
  PackageToolbar,
  COOKIE_GRAPH_LAYOUT,
} from '@commonalityco/feature-graph';
import * as z from 'zod';
import {
  DependencyType,
  Theme,
  numberSafeParse,
} from '@commonalityco/utils-core';
import {
  colorParser,
  directionParser,
  packagesParser,
} from '@commonalityco/feature-graph/query-parsers';
import { getConnectedEdges } from '@xyflow/system';
import LazyGraph from './lazy-graph';
import { EditTagsButton } from '@/components/edit-tags-dialog';
import { Provider } from 'jotai';
import { getConformanceResultsData } from '@/data/conformance';
import { getProjectData } from '@/data/project';
import { unstable_cache } from 'next/cache';

const getSnapshot = unstable_cache(
  async () => {
    const [
      tagsData,
      packages,
      dependencies,
      results,
      codeownersData,
      checkResults,
      project,
    ] = await Promise.all([
      getTagsData(),
      getPackagesData(),
      getDependenciesData(),
      getConstraintsData(),
      getCodeownersData(),
      getConformanceResultsData(),
      getProjectData(),
    ]);

    return {
      tagsData,
      packages,
      dependencies,
      results,
      codeownersData,
      checkResults,
      project,
    };
  },
  [],
  { revalidate: false },
);

async function GraphPage({
  searchParams,
}: {
  searchParams?: {
    packages?: string;
    direction: GraphDirection;
    color: DependencyType[];
  };
}) {
  const cookieStore = cookies();
  const defaultLayoutCookie = cookieStore.get(COOKIE_FILTER_SIDEBAR);
  const graphLayout = cookieStore.get(COOKIE_GRAPH_LAYOUT);
  const defaultTheme = cookieStore.get('commonality:theme')?.value as
    | Theme.Light
    | Theme.Dark
    | undefined;

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

  const {
    tagsData,
    packages,
    dependencies,
    results,
    codeownersData,
    checkResults,
    project,
  } = await getSnapshot();

  const packagesQuery = packagesParser.parseServerSide(searchParams?.packages);
  const colorQuery = colorParser.parseServerSide(searchParams?.color);
  const directionQuery = directionParser.parseServerSide(
    searchParams?.direction,
  );

  const allNodes = getNodes({
    packages,
    dependencies,
    tagsData,
  });

  const allEdges = getEdges({
    results,
    dependencies,
    theme: defaultTheme ?? Theme.Light,
    activeDependencyTypes: colorQuery ?? [DependencyType.PRODUCTION],
  });

  const getShownElements = () => {
    const filteredNodes =
      packagesQuery !== null
        ? allNodes.filter((node) =>
            packagesQuery?.some((pkgName) => pkgName === node.id),
          )
        : allNodes;

    const connectedEdges = getConnectedEdges(filteredNodes, allEdges);

    const elements = getElementsWithLayout({
      nodes: filteredNodes,
      edges: connectedEdges,
      direction: directionQuery ?? GraphDirection.LeftToRight,
    });

    return elements;
  };

  const shownElements = getShownElements();

  const parsedGraphLayout = JSON.parse(graphLayout?.value ?? '[]');

  return (
    <Provider>
      <GraphProviders
        allNodes={allNodes}
        allEdges={allEdges}
        defaultEdges={shownElements.edges}
        defaultNodes={shownElements.nodes}
      >
        <GraphLayoutRoot>
          <GraphLayoutLeftSidebar defaultSize={parsedGraphLayout[0] ?? 0}>
            <GraphFilterSidebar
              tagsData={tagsData}
              codeownersData={codeownersData}
              packages={packages}
              defaultLayout={defaultLayout}
            />
          </GraphLayoutLeftSidebar>
          <GraphLayoutMain defaultSize={parsedGraphLayout[1]}>
            {shownElements.nodes.length === 0 ? (
              <GraphEmpty />
            ) : (
              <>
                <PackageToolbar />
                <Suspense
                  key={JSON.stringify({ packagesQuery, directionQuery })}
                >
                  <LazyGraph
                    dependencies={dependencies}
                    packages={packages}
                    nodes={shownElements.nodes}
                    edges={shownElements.edges}
                    theme={(defaultTheme as 'light' | 'dark') ?? 'light'}
                  />
                  <GraphControlBar />
                </Suspense>
              </>
            )}
          </GraphLayoutMain>
          <GraphLayoutRightSidebar defaultSize={parsedGraphLayout[2] ?? 0}>
            <GraphContextSidebar
              packages={packages}
              projectName={project.name}
              packageManager={project.packageManager}
              tagsData={tagsData}
              codeownersData={codeownersData}
              constraintResults={results}
              checkResults={checkResults}
              packageHeaderContent={<EditTagsButton tagsData={tagsData} />}
            />
          </GraphLayoutRightSidebar>
        </GraphLayoutRoot>
      </GraphProviders>
    </Provider>
  );
}

export default GraphPage;
