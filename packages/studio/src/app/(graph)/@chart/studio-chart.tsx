'use client';
import { FeatureGraphChartLoading } from '@commonalityco/feature-graph/feature-graph-chart-loading';
import dynamic from 'next/dynamic';
import { ComponentProps } from 'react';
import { useTheme } from 'next-themes';
import { useQueryParams } from 'hooks/use-query-params';
import { slugifyPackageName } from '@commonalityco/utils-core';

const FeatureGraphChart = dynamic(
  () => import('@commonalityco/feature-graph/feature-graph-chart'),
  { loading: FeatureGraphChartLoading },
);

function StudioChart(
  props: Omit<ComponentProps<typeof FeatureGraphChart>, 'onPackageClick'>,
) {
  const { resolvedTheme } = useTheme();
  const { setQuery } = useQueryParams();

  return (
    <FeatureGraphChart
      {...props}
      theme={resolvedTheme}
      onPackageClick={(packageName) =>
        setQuery('package', slugifyPackageName(packageName))
      }
    />
  );
}

export default StudioChart;
