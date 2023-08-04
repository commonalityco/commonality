'use client';
import { GraphContext } from './graph-provider';
import { CodeownersData, Package, TagsData } from '@commonalityco/types';
import { GraphLayoutAside, Sidebar } from '@commonalityco/ui-graph';
import { useQuery } from '@tanstack/react-query';
import {
  codeownersKeys,
  packagesKeys,
  tagsKeys,
} from '@commonalityco/utils-graph';
import { useMemo } from 'react';

interface FeatureGraphSidebarProps {
  getCodeownersData: () => Promise<CodeownersData[]>;
  getTags: () => Promise<TagsData[]>;
  getPackages: () => Promise<Package[]>;
}

export function FeatureGraphSidebar(props: FeatureGraphSidebarProps) {
  const [state, send] = GraphContext.useActor();
  const { data: tagsData } = useQuery({
    queryKey: tagsKeys,
    queryFn: () => props.getTags(),
  });
  const { data: codeownersData } = useQuery({
    queryKey: codeownersKeys,
    queryFn: () => props.getCodeownersData(),
  });
  const { data: packages } = useQuery({
    queryKey: packagesKeys,
    queryFn: () => props.getPackages(),
  });

  const visiblePackages = GraphContext.useSelector((state) => {
    if (!state.context.renderGraph) return [];

    return state.context.renderGraph
      .nodes()
      .map((node) => node.data()) as Package[];
  });

  if (!packages || !codeownersData) {
    return null;
  }

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
            selector: (element) => {
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
            selector: (element) => {
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
            selector: (element) => {
              const pkg: Package = element.data();
              const ownerDataForPkg = codeownersData?.find(
                (data) => data.packageName === pkg.name
              );

              return ownerDataForPkg?.codeowners.includes(team) ?? false;
            },
          });
        }}
        onTeamShow={(team) => {
          send({
            type: 'SHOW',
            selector: (element) => {
              const pkg: Package = element.data();
              const ownerDataForPkg = codeownersData?.find(
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
              const ownerDataForPkg = codeownersData?.find(
                (data) => data.packageName === pkg.name
              );

              return ownerDataForPkg?.codeowners.includes(team) ?? false;
            },
          })
        }
        codeownersData={codeownersData}
        tagsData={tagsData ?? []}
        packages={packages}
        visiblePackages={visiblePackages ?? []}
      />
    </GraphLayoutAside>
  );
}
