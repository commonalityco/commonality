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
  COOKIE_GRAPH_LAYOUT_ONE,
  COOKIE_GRAPH_LAYOUT_TWO,
  GraphLayoutRightSidebar,
  GraphContextSidebar,
  COOKIE_GRAPH_LAYOUT_THREE,
} from '@commonalityco/feature-graph';
import * as z from 'zod';
import { DependencyType, Theme } from '@commonalityco/utils-core';
import {
  colorParser,
  directionParser,
  packagesParser,
} from '@commonalityco/feature-graph/query-parsers';
import { getConnectedEdges } from '@xyflow/system';
import LazyGraph from './lazy-graph';
import {
  EditTagsDialog,
  EditTagsDialogContent,
} from '@/components/edit-tags-dialog';
import { Provider } from 'jotai';
import LocalPackageToolbar from './local-package-toolbar';
import { getConformanceResultsData } from '@/data/conformance';

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
  const graphLayoutOne = cookieStore.get(COOKIE_GRAPH_LAYOUT_ONE);
  const graphLayoutTwo = cookieStore.get(COOKIE_GRAPH_LAYOUT_TWO);
  const graphLayoutThree = cookieStore.get(COOKIE_GRAPH_LAYOUT_THREE);

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

  const [
    tagsData,
    packages,
    dependencies,
    results,
    codeownersData,
    checkResults,
  ] = await Promise.all([
    getTagsData(),
    getPackagesData(),
    getDependenciesData(),
    getConstraintsData(),
    getCodeownersData(),
    getConformanceResultsData(),
  ]);

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

  const getShownElements = async () => {
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

  const shownElements = await getShownElements();

  const parseLayoutValue = (value: string | undefined) => {
    if (!value) {
      return undefined;
    }

    try {
      JSON.parse(value);
    } catch {
      return undefined;
    }
  };

  return (
    <Provider>
      <GraphProviders
        allNodes={allNodes}
        allEdges={allEdges}
        defaultEdges={shownElements.edges}
        defaultNodes={shownElements.nodes}
      >
        <EditTagsDialog>
          <EditTagsDialogContent tagsData={tagsData} />
        </EditTagsDialog>
        <GraphLayoutRoot>
          <GraphLayoutLeftSidebar
            defaultSize={parseLayoutValue(graphLayoutOne?.value)}
          >
            <GraphFilterSidebar
              tagsData={tagsData}
              codeownersData={codeownersData}
              packages={packages}
              defaultLayout={defaultLayout}
            />
          </GraphLayoutLeftSidebar>
          <GraphLayoutMain
            defaultSize={parseLayoutValue(graphLayoutTwo?.value)}
          >
            {shownElements.nodes.length === 0 ? (
              <GraphEmpty />
            ) : (
              <>
                <LocalPackageToolbar />
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
          <GraphLayoutRightSidebar
            defaultSize={parseLayoutValue(graphLayoutThree?.value)}
          >
            <GraphContextSidebar
              tagsData={tagsData}
              codeownersData={codeownersData}
              constraintResults={results}
              checkResults={checkResults}
            />
          </GraphLayoutRightSidebar>
        </GraphLayoutRoot>
      </GraphProviders>
    </Provider>
  );
}

export default GraphPage;
