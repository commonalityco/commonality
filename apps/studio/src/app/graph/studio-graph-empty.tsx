'use client';

import { usePackagesQuery } from '../../../../../packages/feature-graph/dist/query/query-hooks';
import { GraphEmpty, useInteractions } from '@commonalityco/ui-graph';
import { Edge, Node } from '@xyflow/react';
import React from 'react';

export function StudioGraphEmpty({
  nodes,
  edges,
}: {
  nodes: Node[];
  edges: Edge[];
}) {
  const [_packagesQuery, setPackagesQuery] = usePackagesQuery({
    packages: nodes.map((node) => node.data),
  });
  const interactions = useInteractions({
    nodes,
    edges,
    onChange: ({ nodes }) => setPackagesQuery(nodes.map((node) => node.id)),
  });

  return <GraphEmpty onShow={interactions.showAll} />;
}
