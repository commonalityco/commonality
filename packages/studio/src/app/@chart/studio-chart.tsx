'use client';
import dynamic from 'next/dynamic';
import { ComponentProps } from 'react';

const FeatureGraphChart = dynamic(
  () => import('@commonalityco/feature-graph/feature-graph-chart'),
);

function StudioChart(props: ComponentProps<typeof FeatureGraphChart>) {
  return <FeatureGraphChart {...props} />;
}

export default StudioChart;
