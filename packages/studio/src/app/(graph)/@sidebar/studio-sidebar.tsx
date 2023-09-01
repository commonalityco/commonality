'use client';
import { FeatureGraphSidebar } from '@commonalityco/feature-graph';
import { setCookie } from 'cookies-next';
import { ComponentProps } from 'react';

function StudioSidebar(props: ComponentProps<typeof FeatureGraphSidebar>) {
  const onLayout = (sizes: number[]) => {
    console.log('setting');
    setCookie('commonality:sidebar-layout', sizes);
  };

  return <FeatureGraphSidebar {...props} onLayout={onLayout} />;
}

export default StudioSidebar;
