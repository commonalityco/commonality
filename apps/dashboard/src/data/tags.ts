'use server';
import 'server-only';
import { cache } from 'react';
import { getRootDirectory } from '@commonalityco/data-project';
import { getTagsData as getTagsDatas } from '@commonalityco/data-tags';
import { getPackages } from '@commonalityco/data-packages';

export const getTagsData = cache(async () => {
  const rootDirectory = await getRootDirectory();
  const packages = await getPackages({ rootDirectory });

  return getTagsDatas({ packages, rootDirectory });
});
