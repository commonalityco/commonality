'use client';
import { Package, TagsData } from '@commonalityco/types';
import { CreateTagsButtonContent } from './create-tags-button-content';

export function CreateTagsButton({
  pkg,
  tagsData,
}: {
  pkg: Package;
  tagsData: TagsData[];
}) {
  return <CreateTagsButtonContent pkg={pkg} tagsData={tagsData} />;
}

export default CreateTagsButton;
