'use client';
import dynamic from 'next/dynamic';
import { FeatureGraphDependencyTooltip } from '@commonalityco/feature-graph';

const FeatureGraphPackageTooltip = dynamic(
  () => import('@commonalityco/feature-graph/feature-graph-package-tooltip'),
);

function StudioGraphOverlays() {
  return (
    <div className="relative z-20">
      <FeatureGraphDependencyTooltip />
      <FeatureGraphPackageTooltip />
    </div>
  );
}

export default StudioGraphOverlays;
