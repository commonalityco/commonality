'use server';
import { setTags } from '@commonalityco/data-tags';
import { Package } from '@commonalityco/types';

export async function setTagsAction({
  pkg,
  tags,
}: {
  pkg: Package;
  tags: string[];
}): Promise<string> {
  return setTags({
    pkg,
    tags,
    rootDirectory: process.env.COMMONALITY_ROOT_DIRECTORY,
  });
}
