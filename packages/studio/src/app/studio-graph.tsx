'use client';
import React, { ComponentPropsWithoutRef } from 'react';
import { useTheme } from 'next-themes';
import dynamic from 'next/dynamic';
import { FeatureGraphLoading } from '@commonalityco/feature-graph';

const FeatureGraph = dynamic(
  () =>
    import('@commonalityco/feature-graph').then(
      (module) => module.FeatureGraph,
    ),
  { loading: FeatureGraphLoading },
);

export function StudioGraph(
  props: Omit<
    ComponentPropsWithoutRef<typeof FeatureGraph>,
    'theme' | 'onSetTags' | 'getElementDefinitionsWithUpdatedLayout'
  >,
) {
  const { resolvedTheme } = useTheme();

  return <FeatureGraph {...props} theme={resolvedTheme} />;
}

export default StudioGraph;
