'use client';

import { GraphEmpty, useInteractions } from '@commonalityco/ui-graph';
import { Edge, Node } from '@xyflow/react';
import React from 'react';
import { useOnInteraction } from './use-on-interaction';

export function StudioGraphEmpty({
  nodes,
  edges,
}: {
  nodes: Node[];
  edges: Edge[];
}) {
  const onInteractionChange = useOnInteraction();
  const interactions = useInteractions({
    nodes,
    edges,
    onChange: onInteractionChange,
  });

  return <GraphEmpty onShow={interactions.showAll} />;
}
