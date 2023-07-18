'use client';
import React, { ComponentPropsWithoutRef } from 'react';
import { useTheme } from 'next-themes';
import { FeatureGraph } from '@commonalityco/feature-graph';
import { setTagsAction } from 'actions/metadata';
import { getUpdatedGraphJsonAction } from 'actions/graph';

function DashboardGraph(
  props: Omit<
    ComponentPropsWithoutRef<typeof FeatureGraph>,
    'theme' | 'onSetTags' | 'getUpdatedGraphJson'
  >
) {
  const { resolvedTheme } = useTheme();

  return (
    <FeatureGraph
      {...props}
      theme={resolvedTheme}
      onSetTags={setTagsAction}
      getUpdatedGraphJson={getUpdatedGraphJsonAction}
    />
  );
}

export default DashboardGraph;
