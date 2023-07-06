'use client';
import { ComponentProps } from 'react';
import { GraphContext } from './graph-provider';
import { GraphToolbar } from '@commonalityco/ui-graph';
import { useQuery } from '@tanstack/react-query';
import { Violation } from '@commonalityco/types';

interface FeatureGraphToolbarProps
  extends Omit<
    ComponentProps<typeof GraphToolbar>,
    | 'shownPackageCount'
    | 'forceEdgeColor'
    | 'onForceEdgeColorChange'
    | 'violations'
  > {
  getViolations: () => Promise<Violation[]>;
}

export function FeatureGraphToolbar({
  getViolations,
  ...props
}: FeatureGraphToolbarProps) {
  const [state, send] = GraphContext.useActor();
  const { data: violations, isLoading } = useQuery({
    queryKey: ['violations'],
    queryFn: () => getViolations(),
  });

  const shownPackageCount = state.context.elements.nodes
    ? state.context.elements.nodes().length
    : props.totalPackageCount;

  if (isLoading || !violations) {
    return null;
  }

  return (
    <GraphToolbar
      {...props}
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
