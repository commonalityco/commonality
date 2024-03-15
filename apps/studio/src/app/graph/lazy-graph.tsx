'use client';
import { ComponentProps } from 'react';
import dynamic from 'next/dynamic';
import { GraphLoading } from '@commonalityco/feature-graph';

const Graph = dynamic(
  () => import('@commonalityco/feature-graph').then((mod) => mod.Graph),
  {
    ssr: false,
    loading: () => <GraphLoading />,
  },
);

function LazyGraph(props: ComponentProps<typeof Graph>) {
  return <Graph {...props} />;
}

export default LazyGraph;
