'use client';
import { FeatureGraphChartLoading } from '@commonalityco/feature-graph/feature-graph-chart-loading';
import dynamic from 'next/dynamic';
import { ComponentProps } from 'react';
import { useTheme } from 'next-themes';

const FeatureGraphChart = dynamic(
  () => import('@commonalityco/feature-graph/feature-graph-chart'),
  { loading: FeatureGraphChartLoading },
);

function StudioChart(props: ComponentProps<typeof FeatureGraphChart>) {
  const { resolvedTheme } = useTheme();
  console.log({ studioTheme: resolvedTheme });
  return <FeatureGraphChart {...props} theme={resolvedTheme} />;
}

export default StudioChart;
