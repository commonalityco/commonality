import {
  FeatureGraphLayout,
  FeatureGraphChartLoading,
  FeatureGraphSidebarLoading,
} from '@commonalityco/feature-graph';

function LoadingPage() {
  return (
    <FeatureGraphLayout>
      <FeatureGraphSidebarLoading />
      <FeatureGraphChartLoading />
    </FeatureGraphLayout>
  );
}

export default LoadingPage;
