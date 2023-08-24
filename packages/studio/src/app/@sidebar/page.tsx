import { getPackagesData } from 'data/packages';
import { getTagsData } from 'data/tags';
import { getCodeownersData } from 'data/codeowners';
import { FeatureGraphSidebar } from '@commonalityco/feature-graph';

async function GraphSidebarPage() {
  const [tagsData, codeownersData, packages] = await Promise.all([
    getTagsData(),
    getCodeownersData(),
    getPackagesData(),
  ]);

  return (
    <FeatureGraphSidebar
      tagsData={tagsData}
      codeownersData={codeownersData}
      packages={packages}
    />
  );
}

export default GraphSidebarPage;
