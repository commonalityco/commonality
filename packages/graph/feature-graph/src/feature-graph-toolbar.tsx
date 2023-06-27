'use client';
import { ComponentProps } from 'react';
import { GraphContext } from './graph-provider';
import { GraphToolbar } from '@commonalityco/ui-graph';

export function FeatureGraphToolbar(
  props: Omit<
    ComponentProps<typeof GraphToolbar>,
    'shownPackageCount' | 'forceEdgeColor' | 'onForceEdgeColorChange'
  >
) {
  const [state, send] = GraphContext.useActor();

  const shownPackageCount = state.context.elements.nodes
    ? state.context.elements.nodes().length
    : props.totalPackageCount;

  return (
    <GraphToolbar
      {...props}
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
