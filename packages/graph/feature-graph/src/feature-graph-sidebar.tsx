'use client';
import { ComponentProps } from 'react';
import sortBy from 'lodash.sortby';
import { GraphContext } from './graph-provider';
import { Package } from '@commonalityco/types';
import { GraphLayoutAside, Sidebar } from '@commonalityco/ui-graph';
import { formatPackageName } from '@commonalityco/utils-package';

export function FeatureGraphSidebar(
  props: Omit<
    ComponentProps<typeof Sidebar>,
    | 'visiblePackages'
    | 'onPackageHide'
    | 'onPackageShow'
    | 'onPackageFocus'
    | 'onTeamHide'
    | 'onTeamShow'
    | 'onTeamFocus'
    | 'onTagHide'
    | 'onTagShow'
    | 'onTagFocus'
    | 'onShowAll'
    | 'onHideAll'
    | 'onPackageClick'
  >
) {
  const [state, send] = GraphContext.useActor();

  const graphPkgs: Package[] = state.context.elements.map((el) => el.data());
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

  const sortedTags = sortBy(props.tags, (item) => item);
  const sortedTeams = sortBy(props.teams, (item) => item);

  return (
    <GraphLayoutAside>
      <Sidebar
        {...props}
        onPackageClick={(packageName) => {
          send({ type: 'NODE_SELECT', packageName });
        }}
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
              return pkg.tags?.includes(tag) ?? false;
            },
          })
        }
        onTagShow={(tag) =>
          send({
            type: 'SHOW',
            selector: (element, index, elements) => {
              const pkg: Package = element.data();
              return pkg.tags?.includes(tag) ?? false;
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

              return pkg.tags?.includes(tag) ?? false;
            },
          })
        }
        onTeamHide={(team) => {
          send({
            type: 'HIDE',
            selector: (element, index, elements) => {
              const pkg: Package = element.data();
              return pkg.owners?.includes(team) ?? false;
            },
          });
        }}
        onTeamShow={(team) => {
          send({
            type: 'SHOW',
            selector: (element, index, elements) => {
              const pkg: Package = element.data();
              return pkg.owners?.includes(team) ?? false;
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

              return pkg.owners?.includes(team) ?? false;
            },
          })
        }
        teams={sortedTeams}
        tags={sortedTags}
        packages={sortedPackages}
        visiblePackages={visiblePackages}
      />
    </GraphLayoutAside>
  );
}
