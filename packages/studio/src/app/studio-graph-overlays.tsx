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
        getTagsData={props.getTagsData}
        getDocumentsData={props.getDocumentsData}
        getCodeownersData={props.getCodeownersData}
      />
      <FeatureGraphDependencySheet
        getViolations={props.getViolations}
        getConstraints={props.getConstraints}
        getTagsData={props.getTagsData}
      />
      <FeatureGraphPackageTooltip />
    </FeatureGraphOverlays>
  );
}

export default StudioGraphOverlays;
