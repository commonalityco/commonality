import {
  FeatureGraphOverlays,
  FeatureGraphPackageTooltip,
  FeatureGraphDependencySheet,
  FeatureGraphPackageSheet,
} from '@commonalityco/feature-graph';
import { ComponentProps } from 'react';

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
        getCreateTagsButton={props.getCreateTagsButton}
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
