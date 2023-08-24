'use client';
import { CodeownersData, DocumentsData, TagsData } from '@commonalityco/types';
import { PackageSheet } from '@commonalityco/ui-graph';
import { GraphContext } from './graph-provider.js';
import { ComponentProps } from 'react';

export function FeatureGraphPackageSheetContent({
  tagsData,
  documentsData,
  codeownersData,
  createTagsButton,
}: {
  tagsData: TagsData[];
  documentsData: DocumentsData[];
  codeownersData: CodeownersData[];
  createTagsButton?: ComponentProps<typeof PackageSheet>['createTagsButton'];
}) {
  const actor = GraphContext.useActorRef();
  const selectedNode = GraphContext.useSelector(
    (state) => state.context.selectedNode,
  );

  return (
    <PackageSheet
      createTagsButton={createTagsButton}
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
