import { FeatureGraphSidebar } from '@commonalityco/feature-graph';
import React from 'react';
import { getPackagesData } from 'data/packages';
import { getTagsData } from 'data/tags';
import { getCodeownersData } from 'data/codeowners';

async function StudioSidebar() {
  const tagsData = await getTagsData();
  const codeownersData = await getCodeownersData();
  const packages = await getPackagesData();

  return (
    <FeatureGraphSidebar
      tagsData={tagsData}
      packages={packages}
      codeownersData={codeownersData}
    />
  );
}

export default StudioSidebar;
