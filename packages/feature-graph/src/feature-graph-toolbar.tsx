'use client';
import { ComponentProps } from 'react';
import { GraphContext } from './graph-provider';
import { GraphToolbar } from '@commonalityco/ui-graph';
import { Package, ProjectConfig, Violation } from '@commonalityco/types';

interface FeatureGraphToolbarProperties
  extends Omit<
    ComponentProps<typeof GraphToolbar>,
    'forceEdgeColor' | 'onForceEdgeColorChange'
  > {
  packages: Package[];
}

export function FeatureGraphToolbar({
  packages,
  ...properties
}: FeatureGraphToolbarProperties) {
  const { send } = GraphContext.useActorRef();

  const shownPackageCount = GraphContext.useSelector((state) =>
    state.context.renderGraph
      ? state.context.renderGraph.nodes().length
      : packages?.length ?? 0,
  );

  return (
    <GraphToolbar
      onFit={() => send({ type: 'FIT', selector: 'node, edge' })}
      onZoomIn={() => send({ type: 'ZOOM_IN' })}
      onZoomOut={() => send({ type: 'ZOOM_OUT' })}
    />
  );
}

export default FeatureGraphToolbar;
