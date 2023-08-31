import { getConstraintsData } from 'data/constraints';
import { getViolationsData } from 'data/violations';
import StudioGraphOverlays from './studio-graph-overlays';
import { preload as preloadPackages } from 'data/packages';
import { preload as preloadProject } from 'data/project';
import { preload as preloadDependencies } from 'data/dependencies';
import { getTagsData } from 'data/tags';

async function GraphPage() {
  preloadPackages();
  preloadProject();
  preloadDependencies();

  const [violations, constraints, tagsData] = await Promise.all([
    getViolationsData(),
    getConstraintsData(),
    getTagsData(),
  ]);

  return (
    <StudioGraphOverlays
      constraints={constraints}
      violations={violations}
      tagsData={tagsData}
    />
  );
}

export default GraphPage;
