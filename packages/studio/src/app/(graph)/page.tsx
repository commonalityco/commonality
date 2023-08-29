import { getTagsData } from 'data/tags';
import { getConstraintsData } from 'data/constraints';
import { getViolationsData } from 'data/violations';
import StudioGraphOverlays from './studio-graph-overlays';
import { preload as preloadPackages } from 'data/packages';
import { preload as preloadProject } from 'data/project';
import { preload as preloadDependencies } from 'data/dependencies';

async function GraphPage() {
  preloadPackages();
  preloadProject();
  preloadDependencies();

  const [tagsData, violations, constraints] = await Promise.all([
    getTagsData(),
    getViolationsData(),
    getConstraintsData(),
  ]);

  return (
    <StudioGraphOverlays
      constraints={constraints}
      tagsData={tagsData}
      violations={violations}
    />
  );
}

export default GraphPage;
