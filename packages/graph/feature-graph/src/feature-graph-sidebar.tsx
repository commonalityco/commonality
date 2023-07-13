'use client';
import { ComponentProps } from 'react';
import sortBy from 'lodash.sortby';
import { GraphContext } from './graph-provider';
import { Package, TagsData } from '@commonalityco/types';
import { GraphLayoutAside, Sidebar } from '@commonalityco/ui-graph';
import { formatPackageName } from '@commonalityco/utils-package';
import { useQuery } from '@tanstack/react-query';

interface FeatureGraphSidebarProps {
  packages: ComponentProps<typeof Sidebar>['packages'];
  codeownersData: ComponentProps<typeof Sidebar>['codeownersData'];
  stripScopeFromPackageNames: ComponentProps<
    typeof Sidebar
  >['stripScopeFromPackageNames'];
  getTags: () => Promise<TagsData[]>;
}

export function FeatureGraphSidebar(props: FeatureGraphSidebarProps) {
  const [state, send] = GraphContext.useActor();
  const { data: tagsData } = useQuery({
    queryKey: ['tags'],
    queryFn: () => props.getTags(),
  });

  const graphPkgs: Package[] = state.context.elements.map(
    (el) => el.data as Package
  );
  const graphPkgNames = graphPkgs.map((pkg) => pkg.name);

  const visiblePackages = props.packages.filter((pkg) => {
    return graphPkgNames.includes(pkg.name);
  });

  const sortedPackages = sortBy(props.packages, (item) => {
    const formattedPackageName = formatPackageName(item.name, {
      stripScope: props.stripScopeFromPackageNames ?? true,
    });

    return formattedPackageName;
  });

  return (
    <GraphLayoutAside>
      <Sidebar
        {...props}
        onHideAll={() => send({ type: 'HIDE_ALL' })}
        onShowAll={() => send({ type: 'SHOW_ALL' })}
        onPackageHide={(pkg) =>
          send({
            type: 'HIDE',
            selector: `node[name="${pkg}"]`,
          })
        }
        onPackageShow={(pkg) =>
          send({ type: 'SHOW', selector: `node[name="${pkg}"]` })
        }
        onPackageFocus={(pkg) =>
          send({ type: 'FOCUS', selector: `node[name="${pkg}"]` })
        }
        onTagHide={(tag) =>
          send({
            type: 'HIDE',
            selector: (element, index, elements) => {
              const pkg: Package = element.data();
              const tagDataForPkg = tagsData?.find(
                (data) => data.packageName === pkg.name
              );

              return tagDataForPkg?.tags.includes(tag) ?? false;
            },
          })
        }
        onTagShow={(tag) =>
          send({
            type: 'SHOW',
            selector: (element, index, elements) => {
              const pkg: Package = element.data();
              const tagDataForPkg = tagsData?.find(
                (data) => data.packageName === pkg.name
              );

              return tagDataForPkg?.tags.includes(tag) ?? false;
            },
          })
        }
        onTagFocus={(tag) =>
          send({
            type: 'FOCUS',
            selector: (el) => {
              if (el.isEdge()) {
                return false;
              }

              const pkg: Package = el.data();
              const tagDataForPkg = tagsData?.find(
                (data) => data.packageName === pkg.name
              );

              return tagDataForPkg?.tags.includes(tag) ?? false;
            },
          })
        }
        onTeamHide={(team) => {
          send({
            type: 'HIDE',
            selector: (element, index, elements) => {
              const pkg: Package = element.data();
              const ownerDataForPkg = props.codeownersData?.find(
                (data) => data.packageName === pkg.name
              );

              return ownerDataForPkg?.codeowners.includes(team) ?? false;
            },
          });
        }}
        onTeamShow={(team) => {
          send({
            type: 'SHOW',
            selector: (element, index, elements) => {
              const pkg: Package = element.data();
              const ownerDataForPkg = props.codeownersData?.find(
                (data) => data.packageName === pkg.name
              );

              return ownerDataForPkg?.codeowners.includes(team) ?? false;
            },
          });
        }}
        onTeamFocus={(team) =>
          send({
            type: 'FOCUS',
            selector: (el) => {
              if (el.isEdge()) {
                return false;
              }

              const pkg: Package = el.data();
              const ownerDataForPkg = props.codeownersData?.find(
                (data) => data.packageName === pkg.name
              );

              return ownerDataForPkg?.codeowners.includes(team) ?? false;
            },
          })
        }
        codeownersData={props.codeownersData}
        tagsData={tagsData ?? []}
        packages={sortedPackages}
        visiblePackages={visiblePackages}
      />
    </GraphLayoutAside>
  );
}
