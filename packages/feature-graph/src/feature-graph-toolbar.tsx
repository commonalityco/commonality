'use client';
import { ComponentProps } from 'react';
import { GraphContext } from './graph-provider.js';
import { GraphToolbar } from '@commonalityco/ui-graph';
import { Constraint, Package, Violation } from '@commonalityco/types';

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
  constraints: Constraint[];
  packages: Package[];
}

export function FeatureGraphToolbar({
  violations,
  constraints,
  packages,
  ...properties
}: FeatureGraphToolbarProperties) {
  const [state, send] = GraphContext.useActor();

  const shownPackageCount = state.context.renderGraph
    ? state.context.renderGraph.nodes().length
    : packages?.length ?? 0;

  if (!violations || !constraints) {
    return;
  }

  return (
    <GraphToolbar
      {...properties}
      totalPackageCount={packages?.length ?? 0}
      constraints={constraints}
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

export default FeatureGraphToolbar;
