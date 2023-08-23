import { GraphLayoutMain } from '@commonalityco/ui-graph';

export function FeatureGraphChartLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  return <GraphLayoutMain>{children}</GraphLayoutMain>;
}

export default FeatureGraphChartLayout;
