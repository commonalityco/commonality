import { getTagsData } from 'data/tags';
import { getCodeownersData } from 'data/codeowners';
import { getDocumentsData } from 'data/documents';
import { getConstraintsData } from 'data/constraints';
import { getViolationsData } from 'data/violations';
import StudioGraphOverlays from './studio-graph-overlays';

async function GraphPage() {
  const documentsData = await getDocumentsData();
  const codeownersData = await getCodeownersData();
  const tagsData = await getTagsData();
  const violations = await getViolationsData();
  const constraints = await getConstraintsData();

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
