import StudioPackageSheetLayout from 'components/studio-package-sheet-layout';
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
  packageSheet,
}: {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  chart: React.ReactNode;
  packageSheet: React.ReactNode;
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
      <StudioPackageSheetLayout>{packageSheet}</StudioPackageSheetLayout>
    </div>
  );
}
