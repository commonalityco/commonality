import StudioGraphOverlays from './studio-graph-overlays';
import { preload as preloadPackages } from '@/data/packages';
import { preload as preloadProject } from '@/data/project';
import { preload as preloadDependencies } from '@/data/dependencies';

async function GraphPage() {
  preloadPackages();
  preloadProject();
  preloadDependencies();

  return <StudioGraphOverlays />;
}

export default GraphPage;
