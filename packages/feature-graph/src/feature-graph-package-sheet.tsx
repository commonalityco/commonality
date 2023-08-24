import { CodeownersData, DocumentsData, TagsData } from '@commonalityco/types';
import FeatureGraphPackageSheetContent from './feature-graph-package-sheet-content.js';
import { ComponentProps } from 'react';

export async function FeatureGraphPackageSheet({
  tagsData,
  documentsData,
  codeownersData,
  createTagsButton,
}: {
  tagsData: TagsData[];
  documentsData: DocumentsData[];
  codeownersData: CodeownersData[];
  createTagsButton?: ComponentProps<
    typeof FeatureGraphPackageSheetContent
  >['createTagsButton'];
}) {
  return (
    <FeatureGraphPackageSheetContent
      tagsData={tagsData}
      codeownersData={codeownersData}
      documentsData={documentsData}
      createTagsButton={createTagsButton}
    />
  );
}

export default FeatureGraphPackageSheet;
