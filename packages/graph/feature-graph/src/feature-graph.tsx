'use client';
import {
  DependencySheet,
  GraphChart,
  GraphLayoutMain,
  PackageSheet,
  TooltipPackage,
} from '@commonalityco/ui-graph';
import { OffloadRenderFn } from '@commonalityco/utils-graph';
import { useEffect, useMemo, useRef } from 'react';
import { PackageManager } from '@commonalityco/utils-core';
import {
  CodeownersData,
  Constraint,
  DocumentsData,
  Package,
  ProjectConfig,
  Violation,
} from '@commonalityco/types';
import { GraphContext } from './graph-provider';
import { FeatureGraphToolbar } from './feature-graph-toolbar';
import { useQuery, useQueryClient } from '@tanstack/react-query';

interface GraphProps {
  stripScopeFromPackageNames?: boolean;
  getUpdatedGraphJson: OffloadRenderFn;
  packages: Package[];
  theme?: string;
  packageManager: PackageManager;
  onSetTags: (options: {
    tags: string[];
    packageName: string;
  }) => Promise<void>;
  isGroupedByTag?: boolean;
  violations: Violation[];
  getTags: () => Promise<Array<{ packageName: string; tags: string[] }>>;
  getViolations: () => Promise<Violation[]>;
  projectConfig: ProjectConfig;
  codeownersData: CodeownersData[];
  documentsData: DocumentsData[];
}

function GraphContent({
  codeownersData,
  documentsData,
  getTags,
  onSetTags,
  getViolations,
  constraints,
}: {
  documentsData: GraphProps['documentsData'];
  codeownersData: GraphProps['codeownersData'];
  getTags: GraphProps['getTags'];
  onSetTags: GraphProps['onSetTags'];
  getViolations: GraphProps['getViolations'];
  constraints: Constraint[];
}) {
  const queryClient = useQueryClient();
  const { data: tagsData } = useQuery({
    queryKey: ['tags'],
    queryFn: () => getTags(),
  });
  const { data: violations } = useQuery({
    queryKey: ['violations'],
    queryFn: () => getViolations(),
  });

  const actor = GraphContext.useActorRef();
  const selectedNode = GraphContext.useSelector(
    (state) => state.context.selectedNode
  );
  const selectedEdge = GraphContext.useSelector(
    (state) => state.context.selectedEdge
  );
  const hoveredRenderNode = GraphContext.useSelector(
    (state) => state.context.hoveredRenderNode
  );
  const hoveredTraversalNode = GraphContext.useSelector(
    (state) => state.context.hoveredTraversalNode
  );

  const dependencyConstraints = useMemo(() => {
    if (!selectedEdge) return [];

    const dependencyConstraints = constraints.filter((constraint) => {
      const sourcePkg: Package = selectedEdge.source().data();
      const tagsForPkg = tagsData?.find(
        (data) => data.packageName === sourcePkg.name
      );

      return tagsForPkg?.tags.includes(constraint.tag);
    });

    return dependencyConstraints;
  }, [selectedEdge, constraints]);

  return (
    <div className="relative z-10">
      <PackageSheet
        documentsData={documentsData}
        codeownersData={codeownersData}
        tagsData={tagsData ?? []}
        node={selectedNode}
        defaultOpen={Boolean(selectedNode)}
        open={Boolean(selectedNode)}
        onOpenChange={() => actor.send('UNSELECT')}
        onSetTags={async (options) => {
          await onSetTags(options);
          await queryClient.invalidateQueries(['tags']);
        }}
      />
      <DependencySheet
        dependency={selectedEdge?.data()}
        defaultOpen={Boolean(selectedEdge)}
        open={Boolean(selectedEdge)}
        onOpenChange={() => actor.send('UNSELECT')}
        violations={violations ?? []}
        constraints={dependencyConstraints}
        source={selectedEdge?.source().id() ?? 'Source pkg'}
        target={selectedEdge?.target().id() ?? 'Target pkg'}
      />
      {hoveredRenderNode && hoveredTraversalNode && (
        <TooltipPackage
          renderNode={hoveredRenderNode}
          traversalNode={hoveredTraversalNode}
          onFocus={(pkg) =>
            actor.send({ type: 'FOCUS', selector: `node[id="${pkg.name}"]` })
          }
          onHide={(pkg) => {
            actor.send({ type: 'HIDE', selector: `node[id="${pkg.name}"]` });
          }}
          onDependenciesHide={(pkg) => {
            actor.send({ type: 'HIDE_DEPENDENCIES', pkg });
          }}
          onDependenciesShow={(pkg) => {
            actor.send({ type: 'SHOW_DEPENDENCIES', pkg });
          }}
          onDependentsHide={(pkg) => {
            actor.send({ type: 'HIDE_DEPENDANTS', pkg });
          }}
          onDependentsShow={(pkg) => {
            actor.send({ type: 'SHOW_DEPENDANTS', pkg });
          }}
        />
      )}
    </div>
  );
}

export function FeatureGraph({
  theme,
  getUpdatedGraphJson,
  packageManager,
  onSetTags,
  isGroupedByTag = false,
  violations,
  packages,
  getTags,
  getViolations,
  projectConfig,
  documentsData,
  codeownersData,
}: GraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const actor = GraphContext.useActorRef();

  const isLoading = GraphContext.useSelector((state) =>
    state.matches('loading')
  );

  const isEmpty = GraphContext.useSelector((state) => {
    return state.matches('success') && state.context.elements.length === 0;
  });

  useEffect(() => {
    if (containerRef.current && packages) {
      actor.send({
        type: 'INITIALIZE',
        containerId: containerRef.current.id,
        packages,
        theme: theme ?? 'light',
        getUpdatedGraphJson,
        isGroupedByTag,
        violations,
      });
    }

    return () => {
      actor.send({ type: 'DESTROY' });
    };
  }, []);

  useEffect(() => {
    if (!theme) return;

    actor.send({ type: 'SET_THEME', theme });
  }, [theme, actor.send]);

  return (
    <GraphLayoutMain>
      <FeatureGraphToolbar
        projectConfig={projectConfig}
        packageManager={packageManager}
        totalPackageCount={packages?.length ?? 0}
        getViolations={getViolations}
        onPackageClick={(packageName) => {
          actor.send({ type: 'NODE_SELECT', packageName });
        }}
      />
      <GraphChart
        ref={containerRef}
        loading={isLoading}
        isEmpty={isEmpty}
        onShowAllPackages={() => {
          actor.send({ type: 'SHOW_ALL' });
        }}
      />
      <GraphContent
        documentsData={documentsData}
        codeownersData={codeownersData}
        constraints={projectConfig.constraints ?? []}
        getTags={getTags}
        getViolations={getViolations}
        onSetTags={async (options) => {
          await onSetTags(options);
          await queryClient.invalidateQueries({ queryKey: ['tags'] });
        }}
      />
    </GraphLayoutMain>
  );
}
