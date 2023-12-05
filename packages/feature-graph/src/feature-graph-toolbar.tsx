'use client';
import { GraphContext } from './graph-provider';
import { GraphToolbar } from '@commonalityco/ui-graph';

export function FeatureGraphToolbar() {
  const { send } = GraphContext.useActorRef();

  return (
    <GraphToolbar
      onFit={() => send({ type: 'FIT', selector: 'node, edge' })}
      onZoomIn={() => send({ type: 'ZOOM_IN' })}
      onZoomOut={() => send({ type: 'ZOOM_OUT' })}
    />
  );
}

export default FeatureGraphToolbar;
