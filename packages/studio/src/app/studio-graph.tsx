import React, { ComponentPropsWithoutRef } from 'react';
import { FeatureGraph } from '@commonalityco/feature-graph';

export function StudioGraph(
  props: Omit<
    ComponentPropsWithoutRef<typeof FeatureGraph>,
    'theme' | 'onSetTags' | 'getElementDefinitionsWithUpdatedLayout'
  >,
) {
  return <FeatureGraph {...props} />;
}

export default StudioGraph;
