'use client';
import {
  FeatureGraphDependencyTooltip,
  FeatureGraphPackageTooltip,
} from '@commonalityco/feature-graph';

function StudioGraphOverlays() {
  return (
    <div className="relative z-20">
      <FeatureGraphDependencyTooltip />
      <FeatureGraphPackageTooltip />
    </div>
  );
}

export default StudioGraphOverlays;
