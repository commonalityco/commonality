'use client';
import { GraphContext } from '@commonalityco/ui-graph';
import { GraphToolbar } from './graph-toolbar';

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
