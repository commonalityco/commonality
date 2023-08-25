import StudioGraphProvider from './studio-graph-provider';
import {
  FeatureGraphChartLayout,
  FeatureGraphLayout,
  FeatureGraphSidebarLayout,
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
      <StudioGraphProvider>
        <FeatureGraphLayout>
          <FeatureGraphSidebarLayout>{sidebar}</FeatureGraphSidebarLayout>
          <FeatureGraphChartLayout>{chart}</FeatureGraphChartLayout>
        </FeatureGraphLayout>
        {children}
      </StudioGraphProvider>
    </div>
  );
}
