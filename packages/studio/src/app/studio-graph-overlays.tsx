'use client';
import { FeatureGraphOverlays } from '@commonalityco/feature-graph/feature-graph-overlays';
import { ComponentProps } from 'react';
import dynamic from 'next/dynamic';

const FeatureGraphPackageSheet = dynamic(
  () => import('@commonalityco/feature-graph/feature-graph-package-sheet'),
);

const FeatureGraphDependencySheet = dynamic(
  () => import('@commonalityco/feature-graph/feature-graph-dependency-sheet'),
);

const FeatureGraphPackageTooltip = dynamic(
  () => import('@commonalityco/feature-graph/feature-graph-package-tooltip'),
);

function StudioGraphOverlays(
  props: ComponentProps<typeof FeatureGraphPackageSheet> &
    ComponentProps<typeof FeatureGraphDependencySheet>,
) {
  return (
    <FeatureGraphOverlays>
      <FeatureGraphPackageSheet
        tagsData={props.tagsData}
        documentsData={props.documentsData}
        codeownersData={props.codeownersData}
      />
      <FeatureGraphDependencySheet
        violations={props.violations}
        constraints={props.constraints}
        tagsData={props.tagsData}
      />
      <FeatureGraphPackageTooltip />
    </FeatureGraphOverlays>
  );
}

export default StudioGraphOverlays;
