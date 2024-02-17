import {
  GraphLayoutAside,
  GraphLayoutMain,
  GraphLayoutRoot,
} from '@commonalityco/ui-constraints';
import { GraphProvider } from '@commonalityco/ui-graph/graph-provider';
import StudioGraphHeader from './studio-graph-header';
import { Provider as JotaiProvider } from 'jotai';

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
        <JotaiProvider>
          <StudioGraphHeader />
          <GraphLayoutRoot>
            <GraphLayoutAside>{sidebar}</GraphLayoutAside>
            <GraphLayoutMain>{chart}</GraphLayoutMain>
          </GraphLayoutRoot>
          {children}
        </JotaiProvider>
      </GraphProvider>
    </div>
  );
}
