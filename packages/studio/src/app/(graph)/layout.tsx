import { GraphProvider } from '@commonalityco/feature-graph';
import {
  GraphLayoutAside,
  GraphLayoutMain,
  GraphLayoutRoot,
} from '@commonalityco/ui-graph';

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
    <div className="bg-secondary h-full">
      <GraphProvider>
        <GraphLayoutRoot>
          <GraphLayoutAside>{sidebar}</GraphLayoutAside>
          <GraphLayoutMain>{chart}</GraphLayoutMain>
        </GraphLayoutRoot>
        {children}
      </GraphProvider>
    </div>
  );
}
