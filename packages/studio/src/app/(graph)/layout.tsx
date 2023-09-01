import {
  FeatureGraphChartLayout,
  FeatureGraphLayout,
  FeatureGraphSidebarLayout,
  GraphProvider,
} from '@commonalityco/feature-graph';

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
        <FeatureGraphLayout>
          <FeatureGraphSidebarLayout>{sidebar}</FeatureGraphSidebarLayout>
          <FeatureGraphChartLayout>{chart}</FeatureGraphChartLayout>
        </FeatureGraphLayout>
        {children}
      </GraphProvider>
    </div>
  );
}
