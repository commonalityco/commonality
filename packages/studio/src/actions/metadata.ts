'use server';
import { setTags } from '@commonalityco/data-tags';
import { metadataKey } from '@commonalityco/utils-graph/query-keys';
import { revalidateTag } from 'next/cache';

export async function setTagsAction({
  packageName,
  tags,
}: {
  packageName: string;
  tags: string[];
}) {
  setTags({
    packageName,
    tags,
    rootDirectory: process.env.COMMONALITY_ROOT_DIRECTORY,
  });

  revalidateTag(metadataKey);
}
