import { getTagsData } from 'data/tags';
import { getCodeownersData } from 'data/codeowners';
import { getDocumentsData } from 'data/documents';
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

  const [documentsData, codeownersData, tagsData, violations, constraints] =
    await Promise.all([
      getDocumentsData(),
      getCodeownersData(),
      getTagsData(),
      getViolationsData(),
      getConstraintsData(),
    ]);

  return (
    <StudioGraphOverlays
      codeownersData={codeownersData}
      constraints={constraints}
      documentsData={documentsData}
      tagsData={tagsData}
      violations={violations}
    />
  );
}

export default GraphPage;
