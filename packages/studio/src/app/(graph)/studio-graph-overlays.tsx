'use client';
import { FeatureGraphOverlays } from '@commonalityco/feature-graph/feature-graph-overlays';
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
    <FeatureGraphOverlays>
      <FeatureGraphDependencyTooltip
        constraints={props.constraints}
        violations={props.violations}
        tagsData={props.tagsData}
      />
      <FeatureGraphPackageTooltip />
    </FeatureGraphOverlays>
  );
}

export default StudioGraphOverlays;
