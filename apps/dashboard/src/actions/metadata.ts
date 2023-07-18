'use server';
import { setTags } from '@commonalityco/data-tags';

export async function setTagsAction({
  packageName,
  tags,
}: {
  packageName: string;
  tags: string[];
}) {
  setTags({ packageName, tags });
}
