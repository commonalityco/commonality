import { getTagsData } from 'data/tags';
import { getCodeownersData } from 'data/codeowners';
import { getDocumentsData } from 'data/documents';
import { getConstraintsData } from 'data/constraints';
import { getViolationsData } from 'data/violations';
import StudioGraphOverlays from './studio-graph-overlays';

async function GraphPage() {
  return (
    <StudioGraphOverlays
      getCodeownersData={getCodeownersData}
      getConstraints={getConstraintsData}
      getDocumentsData={getDocumentsData}
      getTagsData={getTagsData}
      getViolations={getViolationsData}
    />
  );
}

export default GraphPage;
