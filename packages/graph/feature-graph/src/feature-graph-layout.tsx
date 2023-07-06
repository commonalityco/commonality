import { GraphLayoutRoot } from '@commonalityco/ui-graph';
import { GraphProvider } from './graph-provider';
import { DehydratedState } from '@tanstack/react-query';

export function FeatureGraphLayout({
  children,
  dehydratedState,
}: {
  children?: React.ReactNode;
  dehydratedState: DehydratedState;
}) {
  return (
    <GraphProvider dehydratedState={dehydratedState}>
      <GraphLayoutRoot>{children}</GraphLayoutRoot>
    </GraphProvider>
  );
}
