'use client';
import dynamic from 'next/dynamic';
import { ComponentProps } from 'react';

const FeatureGraphSidebar = dynamic(
  () => import('@commonalityco/feature-graph/feature-graph-sidebar'),
);

function StudioSidebar(props: ComponentProps<typeof FeatureGraphSidebar>) {
  return <FeatureGraphSidebar {...props} />;
}

export default StudioSidebar;
