import { GraphLayoutRoot } from '@commonalityco/ui-graph';
import { GraphProvider } from './graph-provider';

export function FeatureGraphLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <GraphProvider>
      <GraphLayoutRoot>{children}</GraphLayoutRoot>
    </GraphProvider>
  );
}
