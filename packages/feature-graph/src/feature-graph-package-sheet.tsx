'use client';
import { CodeownersData, DocumentsData, TagsData } from '@commonalityco/types';
import { PackageSheet } from '@commonalityco/ui-graph';
import { documentsKeys, tagsKeys } from '@commonalityco/utils-graph/query-keys';
import { useQuery } from '@tanstack/react-query';
import { ComponentProps } from 'react';
import { GraphContext } from './graph-provider.js';

export function FeatureGraphPackageSheet({
  getTagsData,
  getDocumentsData,
  getCodeownersData,
  getCreateTagsButton,
}: {
  getTagsData: () => Promise<TagsData[]>;
  getDocumentsData: () => Promise<DocumentsData[]>;
  getCodeownersData: () => Promise<CodeownersData[]>;
  getCreateTagsButton?: ComponentProps<
    typeof PackageSheet
  >['getCreateTagsButton'];
}) {
  const actor = GraphContext.useActorRef();
  const selectedNode = GraphContext.useSelector(
    (state) => state.context.selectedNode,
  );

  const { data: documentsData } = useQuery({
    queryKey: documentsKeys,
    queryFn: () => getDocumentsData(),
  });

  const { data: codeownersData } = useQuery({
    queryKey: documentsKeys,
    queryFn: () => getCodeownersData(),
  });

  const { data: tagsData } = useQuery({
    queryKey: tagsKeys,
    queryFn: () => getTagsData(),
  });

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
      getCreateTagsButton={getCreateTagsButton}
    />
  );
}

export default FeatureGraphPackageSheet;
