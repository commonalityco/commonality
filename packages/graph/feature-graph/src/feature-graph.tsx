'use client';
import {
  DependencySheet,
  GraphChart,
  GraphLayoutMain,
  PackageSheet,
  TooltipPackage,
} from '@commonalityco/ui-graph';
import {
  getElementDefinitions,
  OffloadRenderFn,
} from '@commonalityco/utils-graph';
import { useEffect, useMemo, useRef } from 'react';
import { PackageManager } from '@commonalityco/utils-core';
import { Package, Violation } from '@commonalityco/types';
import { GraphContext } from './graph-provider';
import { FeatureGraphToolbar } from './feature-graph-toolbar';

interface GraphProps {
  stripScopeFromPackageNames?: boolean;
  getUpdatedGraphJson: OffloadRenderFn;
  packages: Package[];
  theme?: string;
  allTags: string[];
  packageManager: PackageManager;
  onSetTags: (options: { tags: string[]; packageName: string }) => void;
  isGroupedByTag?: boolean;
  violations: Violation[];
}

function GraphContent({
  tags,
  onSetTags,
}: {
  tags: string[];
  onSetTags: (options: { tags: string[]; packageName: string }) => void;
}) {
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

  return (
    <div className="relative z-10">
      <PackageSheet
        allTags={tags}
        node={selectedNode}
        defaultOpen={Boolean(selectedNode)}
        open={Boolean(selectedNode)}
        onOpenChange={() => actor.send('UNSELECT')}
        onSetTags={onSetTags}
      />
      <DependencySheet
        edge={selectedEdge}
        defaultOpen={Boolean(selectedEdge)}
        open={Boolean(selectedEdge)}
        onOpenChange={() => actor.send('UNSELECT')}
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
  packages,
  packageManager,
  allTags,
  onSetTags,
  isGroupedByTag = false,
  violations,
}: GraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const actor = GraphContext.useActorRef();
  const isLoading = GraphContext.useSelector((state) =>
    state.matches('loading')
  );
  const actorRef = GraphContext.useActorRef();

  useEffect(() => {
    actorRef.subscribe((state) => {
      console.log({ state });
    });
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      actor.send({
        type: 'INITIALIZE',
        containerId: containerRef.current.id,
        packages,
        theme: theme ?? 'light',
        getUpdatedGraphJson,
        tags: allTags,
        isGroupedByTag,
      });
    }

    return () => {
      actor.send({ type: 'DESTROY' });
    };
  }, [packages]);

  useEffect(() => {
    if (!theme) return;

    actor.send({ type: 'SET_THEME', theme });
  }, [theme, actor.send]);

  return (
    <GraphLayoutMain>
      <FeatureGraphToolbar
        packageManager={packageManager}
        totalPackageCount={packages.length}
        violations={violations}
        onPackageClick={(packageName) => {
          actor.send({ type: 'NODE_SELECT', packageName });
        }}
      />
      <GraphChart ref={containerRef} loading={isLoading} />
      <GraphContent tags={allTags} onSetTags={onSetTags} />
    </GraphLayoutMain>
  );
}
