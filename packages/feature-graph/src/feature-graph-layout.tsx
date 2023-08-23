'use client';
import { GraphLayoutRoot } from '@commonalityco/ui-graph/graph-layout';

export function FeatureGraphLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  return <GraphLayoutRoot>{children}</GraphLayoutRoot>;
}

export default FeatureGraphLayout;
