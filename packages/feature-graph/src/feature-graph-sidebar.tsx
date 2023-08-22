'use client';
import { GraphContext } from './graph-provider.js';
import { CodeownersData, Package, TagsData } from '@commonalityco/types';
import { GraphLayoutAside, Sidebar } from '@commonalityco/ui-graph';
import { useQuery } from '@tanstack/react-query';
import {
  codeownersKeys,
  packagesKeys,
  tagsKeys,
} from '@commonalityco/utils-graph/query-keys';

interface FeatureGraphSidebarProperties {
  getCodeownersData: () => Promise<CodeownersData[]>;
  getTags: () => Promise<TagsData[]>;
  getPackages: () => Promise<Package[]>;
}

export function FeatureGraphSidebar(properties: FeatureGraphSidebarProperties) {
  const { send } = GraphContext.useActorRef();

  const { data: tagsData } = useQuery({
    queryKey: tagsKeys,
    queryFn: () => properties.getTags(),
  });
  const { data: codeownersData } = useQuery({
    queryKey: codeownersKeys,
    queryFn: () => properties.getCodeownersData(),
  });
  const { data: packages } = useQuery({
    queryKey: packagesKeys,
    queryFn: () => properties.getPackages(),
  });

  const visiblePackages = GraphContext.useSelector((state) => {
    if (!state.context.renderGraph) return [];

    return state.context.renderGraph
      .nodes()
      .map((node) => node.data()) as Package[];
  });

  if (!packages || !codeownersData) {
    return;
  }

  return (
    <GraphLayoutAside>
      <Sidebar
        {...properties}
        onHideAll={() => send({ type: 'HIDE_ALL' })}
        onShowAll={() => send({ type: 'SHOW_ALL' })}
        onPackageHide={(package_) =>
          send({
            type: 'HIDE',
            selector: `node[name="${package_}"]`,
          })
        }
        onPackageShow={(package_) =>
          send({ type: 'SHOW', selector: `node[name="${package_}"]` })
        }
        onPackageFocus={(package_) =>
          send({ type: 'FOCUS', selector: `node[name="${package_}"]` })
        }
        onTagHide={(tag) =>
          send({
            type: 'HIDE',
            selector: (element) => {
              const package_: Package = element.data();
              const tagDataForPackage = tagsData?.find(
                (data) => data.packageName === package_.name,
              );

              return tagDataForPackage?.tags.includes(tag) ?? false;
            },
          })
        }
        onTagShow={(tag) =>
          send({
            type: 'SHOW',
            selector: (element) => {
              const package_: Package = element.data();
              const tagDataForPackage = tagsData?.find(
                (data) => data.packageName === package_.name,
              );

              return tagDataForPackage?.tags.includes(tag) ?? false;
            },
          })
        }
        onTagFocus={(tag) =>
          send({
            type: 'FOCUS',
            selector: (element) => {
              if (element.isEdge()) {
                return false;
              }

              const package_: Package = element.data();
              const tagDataForPackage = tagsData?.find(
                (data) => data.packageName === package_.name,
              );

              return tagDataForPackage?.tags.includes(tag) ?? false;
            },
          })
        }
        onTeamHide={(team) => {
          send({
            type: 'HIDE',
            selector: (element) => {
              const package_: Package = element.data();
              const ownerDataForPackage = codeownersData?.find(
                (data) => data.packageName === package_.name,
              );

              return ownerDataForPackage?.codeowners.includes(team) ?? false;
            },
          });
        }}
        onTeamShow={(team) => {
          send({
            type: 'SHOW',
            selector: (element) => {
              const package_: Package = element.data();
              const ownerDataForPackage = codeownersData?.find(
                (data) => data.packageName === package_.name,
              );

              return ownerDataForPackage?.codeowners.includes(team) ?? false;
            },
          });
        }}
        onTeamFocus={(team) =>
          send({
            type: 'FOCUS',
            selector: (element) => {
              if (element.isEdge()) {
                return false;
              }

              const package_: Package = element.data();
              const ownerDataForPackage = codeownersData?.find(
                (data) => data.packageName === package_.name,
              );

              return ownerDataForPackage?.codeowners.includes(team) ?? false;
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

export default FeatureGraphSidebar;
