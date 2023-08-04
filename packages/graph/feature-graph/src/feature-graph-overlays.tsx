'use client';
import {
  CodeownersData,
  Constraint,
  DocumentsData,
  Package,
  TagsData,
  Violation,
} from '@commonalityco/types';
import { useToast } from '@commonalityco/ui-design-system';
import {
  DependencySheet,
  PackageSheet,
  TooltipPackage,
} from '@commonalityco/ui-graph';
import {
  constraintsKeys,
  documentsKeys,
  metadataKey,
  tagsKeys,
  violationsKeys,
} from '@commonalityco/utils-graph';
import { useQuery } from '@tanstack/react-query';
import { ComponentProps, useMemo } from 'react';
import { GraphContext } from './graph-provider';

function FeatureGraphPackageTooltip() {
  const actor = GraphContext.useActorRef();
  const hoveredRenderNode = GraphContext.useSelector(
    (state) => state.context.hoveredRenderNode
  );
  const hoveredTraversalNode = GraphContext.useSelector(
    (state) => state.context.hoveredTraversalNode
  );

  return (
    <>
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
    </>
  );
}

function FeatureGraphDependencySheet({
  getViolations,
  getConstraints,
  getTagsData,
}: {
  getViolations: () => Promise<Violation[]>;
  getConstraints: () => Promise<Constraint[]>;
  getTagsData: () => Promise<TagsData[]>;
}) {
  const { data: tagsData } = useQuery({
    queryKey: tagsKeys,
    queryFn: () => getTagsData(),
  });

  const { data: violations } = useQuery({
    queryKey: violationsKeys,
    queryFn: () => getViolations(),
  });

  const { data: constraints } = useQuery({
    queryKey: constraintsKeys,
    queryFn: () => getConstraints(),
  });

  const actor = GraphContext.useActorRef();
  const selectedEdge = GraphContext.useSelector(
    (state) => state.context.selectedEdge
  );

  const dependencyConstraints = useMemo(() => {
    if (!selectedEdge || !constraints) return [];

    const dependencyConstraints =
      constraints?.filter((constraint) => {
        const sourcePkg: Package = selectedEdge.source().data();
        const tagsForPkg = tagsData?.find(
          (data) => data.packageName === sourcePkg.name
        );

        return tagsForPkg?.tags.includes(constraint.applyTo);
      }) ?? [];

    return dependencyConstraints;
  }, [selectedEdge, constraints]);

  return (
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
  );
}

function FeatureGraphPackageSheet({
  getTagsData,
  getDocumentsData,
  getCodeownersData,
  getCreateTagsButton,
}: {
  getTagsData: () => Promise<TagsData[]>;
  getDocumentsData: () => Promise<DocumentsData[]>;
  getCodeownersData: () => Promise<CodeownersData[]>;
  getCreateTagsButton?: ComponentProps<
    typeof PackageSheet
  >['getCreateTagsButton'];
}) {
  const actor = GraphContext.useActorRef();
  const selectedNode = GraphContext.useSelector(
    (state) => state.context.selectedNode
  );

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

  if (!documentsData || !codeownersData) {
    return null;
  }

  return (
    <PackageSheet
      documentsData={documentsData}
      codeownersData={codeownersData}
      tagsData={tagsData ?? []}
      pkg={selectedNode?.data()}
      defaultOpen={Boolean(selectedNode)}
      open={Boolean(selectedNode)}
      onOpenChange={() => actor.send('UNSELECT')}
      getCreateTagsButton={getCreateTagsButton}
    />
  );
}

function FeatureGraphOverlays({ children }: { children: React.ReactNode }) {
  return <div className="relative z-20">{children}</div>;
}

FeatureGraphOverlays.displayName = 'FeatureGraphOverlays';

export {
  FeatureGraphOverlays,
  FeatureGraphPackageTooltip,
  FeatureGraphDependencySheet,
  FeatureGraphPackageSheet,
};
