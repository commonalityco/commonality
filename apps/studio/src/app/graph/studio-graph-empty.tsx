'use client';

import { GraphEmpty, useInteractions } from '@commonalityco/ui-graph';
import { Edge, Node } from '@xyflow/react';
import React from 'react';
import { usePackagesQuery } from './graph-hooks';

export function StudioGraphEmpty({
  nodes,
  edges,
}: {
  nodes: Node[];
  edges: Edge[];
}) {
  const { setPackagesQuery } = usePackagesQuery();
  const interactions = useInteractions({
    nodes,
    edges,
    onChange: ({ nodes }) => setPackagesQuery(nodes.map((node) => node.id)),
  });

  return <GraphEmpty onShow={interactions.showAll} />;
}
