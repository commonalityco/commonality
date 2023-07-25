'use client';
import React, { ComponentPropsWithoutRef } from 'react';
import { useTheme } from 'next-themes';
import { FeatureGraph } from '@commonalityco/feature-graph';
import { setTagsAction } from 'actions/metadata';

function DashboardGraph(
  props: Omit<
    ComponentPropsWithoutRef<typeof FeatureGraph>,
    'theme' | 'onSetTags' | 'getElementDefinitionsWithUpdatedLayout'
  >
) {
  const { resolvedTheme } = useTheme();

  return (
    <FeatureGraph {...props} theme={resolvedTheme} onSetTags={setTagsAction} />
  );
}

export default DashboardGraph;
