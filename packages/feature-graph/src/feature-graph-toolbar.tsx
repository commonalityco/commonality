'use client';
import { ComponentProps } from 'react';
import { GraphContext } from './graph-provider';
import { GraphToolbar } from '@commonalityco/ui-graph';
import { Package, ProjectConfig, Violation } from '@commonalityco/types';

interface FeatureGraphToolbarProperties
  extends Omit<
    ComponentProps<typeof GraphToolbar>,
    | 'shownPackageCount'
    | 'forceEdgeColor'
    | 'onForceEdgeColorChange'
    | 'violations'
    | 'constraints'
    | 'totalPackageCount'
  > {
  violations: Violation[];
  constraints: ProjectConfig['constraints'];
  packages: Package[];
}

export function FeatureGraphToolbar({
  violations,
  constraints,
  packages,
  ...properties
}: FeatureGraphToolbarProperties) {
  const { send } = GraphContext.useActorRef();
  const isEdgeColorShown = GraphContext.useSelector(
    (state) => state.context.isEdgeColorShown,
  );

  const shownPackageCount = GraphContext.useSelector((state) =>
    state.context.renderGraph
      ? state.context.renderGraph.nodes().length
      : packages?.length ?? 0,
  );

  if (!violations || !constraints) {
    return;
  }

  return (
    <GraphToolbar
      {...properties}
      totalPackageCount={packages?.length ?? 0}
      constraints={constraints}
      violations={violations}
      isEdgeColorShown={isEdgeColorShown}
      onSetIsEdgeColorShown={(newIsEdgeColorShown) =>
        send({ type: 'SET_IS_EDGE_COLOR_SHOWN', isShown: newIsEdgeColorShown })
      }
      shownPackageCount={shownPackageCount}
      onFit={() => send({ type: 'FIT', selector: 'node, edge' })}
      onZoomIn={() => send({ type: 'ZOOM_IN' })}
      onZoomOut={() => send({ type: 'ZOOM_OUT' })}
    />
  );
}

export default FeatureGraphToolbar;
