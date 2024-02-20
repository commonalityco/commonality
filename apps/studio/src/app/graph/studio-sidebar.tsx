'use client';
import { Sidebar } from '@commonalityco/ui-constraints';
import {
  PackageNodeData,
  getNodes,
} from '@commonalityco/ui-graph/package/get-nodes';
import { getEdges, useInteractions } from '@commonalityco/ui-graph';
import { setCookie } from 'cookies-next';
import { ComponentProps } from 'react';
import { useNodes, Node } from '@xyflow/react';
import {
  CodeownersData,
  Dependency,
  Package,
  TagsData,
} from '@commonalityco/types';
import { useTheme } from 'next-themes';
import { useOnInteraction } from './use-on-interaction';

function StudioSidebar(props: {
  tagsData: TagsData[];
  codeownersData: CodeownersData[];
  packages: Package[];
  dependencies: Dependency[];
  onLayout?: ComponentProps<typeof Sidebar>['onLayout'];
  defaultLayout?: ComponentProps<typeof Sidebar>['defaultLayout'];
}) {
  const { resolvedTheme } = useTheme();
  const nodes = useNodes<Node<PackageNodeData>>();

  const onInteraction = useOnInteraction();

  const interactions = useInteractions({
    nodes: getNodes({
      packages: props.packages,
      tagsData: props.tagsData,
      dependencies: props.dependencies,
    }),
    edges: getEdges({
      dependencies: props.dependencies,
      theme: resolvedTheme as 'light' | 'dark',
    }),
    onChange: onInteraction,
  });

  const visiblePackages = nodes.map((node) => node.data.package);

  return (
    <Sidebar
      codeownersData={props.codeownersData}
      onLayout={(sizes) => {
        setCookie('commonality:sidebar-layout', sizes);
      }}
      defaultLayout={props.defaultLayout}
      tagsData={props.tagsData ?? []}
      packages={props.packages}
      visiblePackages={visiblePackages ?? []}
      onHideAll={interactions.hideAll}
      onShowAll={() => interactions.showAll()}
      onPackageFocus={(packageName) => interactions.focus([packageName])}
      onPackageHide={(packageName) => interactions.hide([packageName])}
      onPackageShow={(packageName) => interactions.show([packageName])}
      onTagFocus={(tag) => {
        const packageNames = props.tagsData
          .filter((data) => data.tags.includes(tag))
          .map((data) => data.packageName);

        interactions.focus(packageNames);
      }}
      onTagHide={(tag) => {
        const packageNames = props.tagsData
          .filter((data) => data.tags.includes(tag))
          .map((data) => data.packageName);

        interactions.hide(packageNames);
      }}
      onTagShow={(tag) => {
        const packageNames = props.tagsData
          .filter((data) => data.tags.includes(tag))
          .map((data) => data.packageName);

        interactions.show(packageNames);
      }}
      onTeamFocus={(codeowner) => {
        const packageNames = props.codeownersData
          .filter((data) => data.codeowners.includes(codeowner))
          .map((pkg) => pkg.packageName);

        interactions.focus(packageNames);
      }}
      onTeamHide={(codeowner) => {
        const packageNames = props.codeownersData
          .filter((data) => data.codeowners.includes(codeowner))
          .map((pkg) => pkg.packageName);

        interactions.hide(packageNames);
      }}
      onTeamShow={(codeowner) => {
        const packageNames = props.codeownersData
          .filter((data) => data.codeowners.includes(codeowner))
          .map((pkg) => pkg.packageName);

        interactions.show(packageNames);
      }}
    />
  );
}

export default StudioSidebar;
