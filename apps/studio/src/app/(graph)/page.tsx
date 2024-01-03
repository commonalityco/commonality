import StudioGraphOverlays from './studio-graph-overlays';
import { preload as preloadPackages } from '@/data/packages';
import { preload as preloadProject } from '@/data/project';
import { preload as preloadDependencies } from '@/data/dependencies';
import { getTagsData } from '@/data/tags';

async function GraphPage() {
  preloadPackages();
  preloadProject();
  preloadDependencies();

  const tagsData = await getTagsData();

  return <StudioGraphOverlays tagsData={tagsData} />;
}

export default GraphPage;
