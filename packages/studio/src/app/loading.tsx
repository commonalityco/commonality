import {
  FeatureGraphLayout,
  FeatureGraphLoading,
  FeatureGraphSidebarLoading,
} from '@commonalityco/feature-graph';

function LoadingPage() {
  return (
    <FeatureGraphLayout>
      <FeatureGraphSidebarLoading />
      <FeatureGraphLoading />
    </FeatureGraphLayout>
  );
}

export default LoadingPage;
