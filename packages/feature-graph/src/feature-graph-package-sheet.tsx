import { CodeownersData, DocumentsData, TagsData } from '@commonalityco/types';
import FeatureGraphPackageSheetContent from './feature-graph-package-sheet-content.js';

export async function FeatureGraphPackageSheet({
  tagsData,
  documentsData,
  codeownersData,
}: {
  tagsData: TagsData[];
  documentsData: DocumentsData[];
  codeownersData: CodeownersData[];
}) {
  return (
    <FeatureGraphPackageSheetContent
      tagsData={tagsData}
      codeownersData={codeownersData}
      documentsData={documentsData}
    />
  );
}

export default FeatureGraphPackageSheet;
