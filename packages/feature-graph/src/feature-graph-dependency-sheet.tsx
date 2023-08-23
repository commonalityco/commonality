import { Constraint, TagsData, Violation } from '@commonalityco/types';
import FeatureGraphDependencySheetContent from './feature-graph-dependency-sheet-content.js';

export async function FeatureGraphDependencySheet({
  getViolations,
  getConstraints,
  getTagsData,
}: {
  getViolations: () => Promise<Violation[]>;
  getConstraints: () => Promise<Constraint[]>;
  getTagsData: () => Promise<TagsData[]>;
}) {
  const tagsData = await getTagsData();
  const violations = await getViolations();
  const constraints = await getConstraints();

  return (
    <FeatureGraphDependencySheetContent
      tagsData={tagsData}
      violations={violations}
      constraints={constraints}
    />
  );
}

export default FeatureGraphDependencySheet;
