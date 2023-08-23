import 'server-only';
import { CodeownersData, DocumentsData, TagsData } from '@commonalityco/types';
import FeatureGraphPackageSheetContent from './feature-graph-package-sheet-content.js';

export async function FeatureGraphPackageSheet({
  getTagsData,
  getDocumentsData,
  getCodeownersData,
}: {
  getTagsData: () => Promise<TagsData[]>;
  getDocumentsData: () => Promise<DocumentsData[]>;
  getCodeownersData: () => Promise<CodeownersData[]>;
}) {
  const documentsData = await getDocumentsData();
  const codeownersData = await getCodeownersData();
  const tagsData = await getTagsData();

  return (
    <FeatureGraphPackageSheetContent
      tagsData={tagsData}
      codeownersData={codeownersData}
      documentsData={documentsData}
    />
  );
}

export default FeatureGraphPackageSheet;
