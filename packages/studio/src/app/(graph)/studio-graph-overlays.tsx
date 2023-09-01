'use client';
import { ComponentProps } from 'react';
import dynamic from 'next/dynamic';
import { FeatureGraphDependencyTooltip } from '@commonalityco/feature-graph';

const FeatureGraphPackageTooltip = dynamic(
  () => import('@commonalityco/feature-graph/feature-graph-package-tooltip'),
);

function StudioGraphOverlays(
  props: ComponentProps<typeof FeatureGraphDependencyTooltip>,
) {
  return (
    <div className="relative z-20">
      <FeatureGraphDependencyTooltip
        constraints={props.constraints}
        violations={props.violations}
        tagsData={props.tagsData}
      />
      <FeatureGraphPackageTooltip />
    </div>
  );
}

export default StudioGraphOverlays;
