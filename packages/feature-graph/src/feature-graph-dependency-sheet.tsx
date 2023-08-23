import { Constraint, TagsData, Violation } from '@commonalityco/types';
import FeatureGraphDependencySheetContent from './feature-graph-dependency-sheet-content.js';

export async function FeatureGraphDependencySheet({
  violations,
  constraints,
  tagsData,
}: {
  violations: Violation[];
  constraints: Constraint[];
  tagsData: TagsData[];
}) {
  return (
    <FeatureGraphDependencySheetContent
      tagsData={tagsData}
      violations={violations}
      constraints={constraints}
    />
  );
}

export default FeatureGraphDependencySheet;
