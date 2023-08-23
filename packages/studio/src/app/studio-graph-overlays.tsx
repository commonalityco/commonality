import { FeatureGraphOverlays } from '@commonalityco/feature-graph/feature-graph-overlays';
import { ComponentProps } from 'react';
import {
  FeatureGraphDependencySheet,
  FeatureGraphPackageSheet,
  FeatureGraphPackageTooltip,
} from '@commonalityco/feature-graph';

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
