'use client';
import { ComponentProps } from 'react';
import { GraphContext } from './graph-provider';
import { GraphToolbar } from '@commonalityco/ui-graph';
import { useQuery } from '@tanstack/react-query';
import { Package, ProjectConfig, Violation } from '@commonalityco/types';
import {
  packagesKeys,
  projectConfigKeys,
  violationsKeys,
} from '@commonalityco/utils-graph';

interface FeatureGraphToolbarProps
  extends Omit<
    ComponentProps<typeof GraphToolbar>,
    | 'shownPackageCount'
    | 'forceEdgeColor'
    | 'onForceEdgeColorChange'
    | 'violations'
    | 'projectConfig'
    | 'totalPackageCount'
  > {
  getProjectConfig: () => Promise<ProjectConfig>;
  getViolations: () => Promise<Violation[]>;
  getPackages: () => Promise<Package[]>;
}

export function FeatureGraphToolbar({
  getViolations,
  getProjectConfig,
  getPackages,
  ...props
}: FeatureGraphToolbarProps) {
  const [state, send] = GraphContext.useActor();
  const { data: violations } = useQuery({
    queryKey: violationsKeys,
    queryFn: () => getViolations(),
  });
  const { data: projectConfig } = useQuery({
    queryKey: projectConfigKeys,
    queryFn: () => getProjectConfig(),
  });
  const { data: packages } = useQuery({
    queryKey: packagesKeys,
    queryFn: () => getPackages(),
  });

  const shownPackageCount = state.context.renderGraph
    ? state.context.renderGraph.nodes().length
    : packages?.length ?? 0;

  if (!violations || !projectConfig) {
    return null;
  }

  return (
    <GraphToolbar
      {...props}
      totalPackageCount={packages?.length ?? 0}
      projectConfig={projectConfig}
      violations={violations}
      isEdgeColorShown={state.context.isEdgeColorShown}
      onSetIsEdgeColorShown={(isEdgeColorShown) =>
        send({ type: 'SET_IS_EDGE_COLOR_SHOWN', isShown: isEdgeColorShown })
      }
      shownPackageCount={shownPackageCount}
      onFit={() => send({ type: 'FIT', selector: 'node, edge' })}
      onZoomIn={() => send({ type: 'ZOOM_IN' })}
      onZoomOut={() => send({ type: 'ZOOM_OUT' })}
    />
  );
}
