import {
  GraphLayoutAside,
  GraphLayoutMain,
  GraphLayoutRoot,
} from '@commonalityco/ui-constraints';
import { GraphProvider } from '@commonalityco/ui-graph/graph-provider';
import StudioGraphHeader from './studio-graph-header';

export default async function RootLayout({
  children,
  sidebar,
  chart,
}: {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  chart: React.ReactNode;
}) {
  return (
    <div className="h-full flex flex-col">
      <GraphProvider>
        <StudioGraphHeader />
        <GraphLayoutRoot>
          <GraphLayoutAside>{sidebar}</GraphLayoutAside>
          <GraphLayoutMain>{chart}</GraphLayoutMain>
        </GraphLayoutRoot>
        {children}
      </GraphProvider>
    </div>
  );
}
