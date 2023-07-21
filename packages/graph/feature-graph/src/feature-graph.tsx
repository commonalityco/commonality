'use client';
import {
  DependencySheet,
  GraphChart,
  GraphLayoutMain,
  PackageSheet,
  TooltipPackage,
} from '@commonalityco/ui-graph';
import {
  documentsKeys,
  metadataKey,
  OffloadRenderFn,
  packagesKeys,
  projectConfigKeys,
  tagsKeys,
  violationsKeys,
} from '@commonalityco/utils-graph';
import { useEffect, useMemo, useRef } from 'react';
import { PackageManager } from '@commonalityco/utils-core';
import {
  CodeownersData,
  DocumentsData,
  Package,
  ProjectConfig,
  TagsData,
  Violation,
} from '@commonalityco/types';
import { GraphContext } from './graph-provider';
import { FeatureGraphToolbar } from './feature-graph-toolbar';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { cn } from '@commonalityco/ui-design-system';
import debounce from 'lodash.debounce';

interface GraphProps {
  getUpdatedGraphJson: OffloadRenderFn;
  theme?: string;
  packageManager: PackageManager;
  onSetTags: (tagsData: TagsData) => Promise<void>;
  getPackages: () => Promise<Package[]>;
  getDocumentsData: () => Promise<DocumentsData[]>;
  getCodeownersData: () => Promise<CodeownersData[]>;
  getViolations: () => Promise<Violation[]>;
  getProjectConfig: () => Promise<ProjectConfig>;
  getTagsData: () => Promise<TagsData[]>;
}

export function FeatureGraph({
  theme,
  getUpdatedGraphJson,
  packageManager,
  onSetTags,
  getTagsData,
  getViolations,
  getPackages,
  getDocumentsData,
  getProjectConfig,
  getCodeownersData,
}: GraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const { data: packages } = useQuery({
    queryKey: packagesKeys,
    queryFn: () => getPackages(),
  });

  const { data: violations } = useQuery({
    queryKey: violationsKeys,
    queryFn: getViolations,
  });

  const actor = GraphContext.useActorRef();

  const isLoading = GraphContext.useSelector((state) =>
    state.matches('loading')
  );

  const isEmpty = GraphContext.useSelector((state) => {
    return state.matches('success') && state.context.elements.length === 0;
  });

  const isHovering = GraphContext.useSelector(
    (state) => state.context.hoveredRenderNode
  );

  const renderGraph = GraphContext.useSelector(
    (state) => state.context.renderGraph
  );

  useEffect(() => {
    const listener = debounce(() => {
      renderGraph?.resize();
      actor.send('FIT');
    }, 50);

    window.addEventListener('resize', listener);

    return () => window.removeEventListener('resize', listener);
  }, [renderGraph]);

  useEffect(() => {
    if (!violations || !packages) {
      return;
    }

    if (containerRef.current && packages) {
      actor.send({
        type: 'INITIALIZE',
        containerId: containerRef.current.id,
        packages,
        theme: theme ?? 'light',
        getUpdatedGraphJson,
        violations,
      });
    }

    return () => {
      actor.send({ type: 'DESTROY' });
    };
  }, [violations, packages]);

  useEffect(() => {
    if (!theme) return;

    actor.send({ type: 'SET_THEME', theme });
  }, [theme, actor.send]);

  return (
    <GraphLayoutMain>
      <FeatureGraphToolbar
        packageManager={packageManager}
        getProjectConfig={getProjectConfig}
        getPackages={getPackages}
        getViolations={getViolations}
        onPackageClick={(packageName) => {
          actor.send({ type: 'NODE_SELECT', packageName });
        }}
      />
      <GraphChart
        ref={containerRef}
        loading={isLoading}
        isEmpty={isEmpty}
        className={cn({
          'cursor-pointer': isHovering,
          'cursor-grab active:cursor-grabbing': !isHovering,
        })}
        onShowAllPackages={() => {
          actor.send({ type: 'SHOW_ALL' });
        }}
      />
    </GraphLayoutMain>
  );
}
