import { GraphLayoutRoot } from '@commonalityco/ui-graph';

export function FeatureGraphLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  return <GraphLayoutRoot>{children}</GraphLayoutRoot>;
}

export default FeatureGraphLayout;
