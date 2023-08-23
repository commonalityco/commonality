'use client';
import { CodeownersData, Package, TagsData } from '@commonalityco/types';
import FeatureGraphSidebarContent from './feature-graph-sidebar-content.js';

interface FeatureGraphSidebarProperties {
  codeownersData: CodeownersData[];
  tagsData: TagsData[];
  packages: Package[];
}

export async function FeatureGraphSidebar({
  tagsData,
  codeownersData,
  packages,
}: FeatureGraphSidebarProperties) {
  return (
    <FeatureGraphSidebarContent
      tagsData={tagsData}
      codeownersData={codeownersData}
      packages={packages}
    />
  );
}

export default FeatureGraphSidebar;
