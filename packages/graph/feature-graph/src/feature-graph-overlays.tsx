'use client';
import {
  CodeownersData,
  DocumentsData,
  Package,
  ProjectConfig,
  TagsData,
  Violation,
} from '@commonalityco/types';
import { useToast } from '@commonalityco/ui-design-system';
import { ToastAction } from '@commonalityco/ui-design-system/src/components/toast';
import {
  DependencySheet,
  PackageSheet,
  TooltipPackage,
} from '@commonalityco/ui-graph';
import {
  documentsKeys,
  metadataKey,
  projectConfigKeys,
  tagsKeys,
  violationsKeys,
} from '@commonalityco/utils-graph';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { GraphContext } from './graph-provider';

function FeatureGraphOverlays({
  onSetTags,
  getTagsData,
  getDocumentsData,
  getProjectConfig,
  getCodeownersData,
  getViolations,
}: {
  onSetTags: (tagsData: TagsData) => Promise<void>;
  getTagsData: () => Promise<TagsData[]>;
  getDocumentsData: () => Promise<DocumentsData[]>;
  getCodeownersData: () => Promise<CodeownersData[]>;
  getProjectConfig: () => Promise<ProjectConfig>;
  getViolations: () => Promise<Violation[]>;
}) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  const { data: violations } = useQuery({
    queryKey: violationsKeys,
    queryFn: () => getViolations(),
  });

  const { data: documentsData } = useQuery({
    queryKey: documentsKeys,
    queryFn: () => getDocumentsData(),
  });

  const { data: codeownersData } = useQuery({
    queryKey: documentsKeys,
    queryFn: () => getCodeownersData(),
  });

  const { data: tagsData } = useQuery({
    queryKey: tagsKeys,
    queryFn: () => getTagsData(),
  });

  const { data: projectConfig } = useQuery({
    queryKey: projectConfigKeys,
    queryFn: () => getProjectConfig(),
  });

  const dependencyConstraints = useMemo(() => {
    if (!selectedEdge || !projectConfig) return [];

    const dependencyConstraints =
      projectConfig?.constraints?.filter((constraint) => {
        const sourcePkg: Package = selectedEdge.source().data();
        const tagsForPkg = tagsData?.find(
          (data) => data.packageName === sourcePkg.name
        );

        return tagsForPkg?.tags.includes(constraint.applyTo);
      }) ?? [];

    return dependencyConstraints;
  }, [selectedEdge, projectConfig]);

  if (!documentsData || !codeownersData) {
    return null;
  }

  return (
    <div className="relative z-10">
      <PackageSheet
        documentsData={documentsData}
        codeownersData={codeownersData}
        tagsData={tagsData ?? []}
        pkg={selectedNode?.data()}
        defaultOpen={Boolean(selectedNode)}
        open={Boolean(selectedNode)}
        onOpenChange={() => actor.send('UNSELECT')}
        onSetTags={async (options) => {
          await onSetTags(options);
          await queryClient.invalidateQueries({
            queryKey: [metadataKey],
          });
          toast({
            description: 'Successfully updated package configuration',
          });
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

FeatureGraphOverlays.displayName = 'FeatureGraphOverlays';

export { FeatureGraphOverlays };
