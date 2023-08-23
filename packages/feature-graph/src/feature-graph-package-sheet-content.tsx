'use client';
import { CodeownersData, DocumentsData, TagsData } from '@commonalityco/types';
import { PackageSheet } from '@commonalityco/ui-graph';
import { GraphContext } from './graph-provider.js';

export function FeatureGraphPackageSheetContent({
  tagsData,
  documentsData,
  codeownersData,
}: {
  tagsData: TagsData[];
  documentsData: DocumentsData[];
  codeownersData: CodeownersData[];
}) {
  const actor = GraphContext.useActorRef();
  const selectedNode = GraphContext.useSelector(
    (state) => state.context.selectedNode,
  );

  if (!documentsData || !codeownersData) {
    return;
  }

  return (
    <PackageSheet
      documentsData={documentsData}
      codeownersData={codeownersData}
      tagsData={tagsData ?? []}
      pkg={selectedNode?.data()}
      defaultOpen={Boolean(selectedNode)}
      open={Boolean(selectedNode)}
      onOpenChange={() => actor.send('UNSELECT')}
    />
  );
}

export default FeatureGraphPackageSheetContent;
