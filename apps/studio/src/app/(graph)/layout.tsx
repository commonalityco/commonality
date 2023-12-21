import {
  GraphLayoutAside,
  GraphLayoutMain,
  GraphLayoutRoot,
  GraphProvider,
} from '@commonalityco/ui-constraints';
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
