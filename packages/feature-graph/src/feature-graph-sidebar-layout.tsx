import { GraphLayoutAside } from '@commonalityco/ui-graph/graph-layout';

export function FeatureGraphSidebarLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  return <GraphLayoutAside>{children}</GraphLayoutAside>;
}
export default FeatureGraphSidebarLayout;
