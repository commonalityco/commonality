'use client';
import { FeatureGraphSidebar } from '@commonalityco/feature-constraints/components';
import { setCookie } from 'cookies-next';
import { ComponentProps } from 'react';

function StudioSidebar(props: ComponentProps<typeof FeatureGraphSidebar>) {
  return (
    <FeatureGraphSidebar
      {...props}
      onLayout={(sizes) => {
        setCookie('commonality:sidebar-layout', sizes);
      }}
    />
  );
}

export default StudioSidebar;
