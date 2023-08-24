import { getPackagesData } from 'data/packages';
import { getTagsData } from 'data/tags';
import { getCodeownersData } from 'data/codeowners';
import StudioSidebar from './studio-sidebar';

async function GraphSidebarPage() {
  const [tagsData, codeownersData, packages] = await Promise.all([
    getTagsData(),
    getCodeownersData(),
    getPackagesData(),
  ]);

  return (
    <StudioSidebar
      tagsData={tagsData}
      codeownersData={codeownersData}
      packages={packages}
    />
  );
}

export default GraphSidebarPage;
