'use server';
import { setTags } from '@commonalityco/data-tags';
import { revalidatePath } from 'next/cache';

export async function setTagsAction({
  packageName,
  tags,
}: {
  packageName: string;
  tags: string[];
}) {
  setTags({ packageName, tags });
  revalidatePath('/');
}
