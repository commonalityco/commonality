'use client';
import { FeatureGraphSidebarLoading } from '@commonalityco/feature-graph';
import dynamic from 'next/dynamic';
import React, { ComponentProps } from 'react';

const FeatureGraphSidebar = dynamic(
  () =>
    import('@commonalityco/feature-graph').then(
      (module) => module.FeatureGraphSidebar
    ),
  {
    ssr: false,
    loading: FeatureGraphSidebarLoading,
  }
);

export function StudioSidebar(
  props: ComponentProps<typeof FeatureGraphSidebar>
) {
  return <FeatureGraphSidebar {...props} />;
}
