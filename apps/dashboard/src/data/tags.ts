'use server';
import 'server-only';
import { cache } from 'react';
import { getTagsData as getTagsDatas } from '@commonalityco/data-tags';
import { getPackages } from '@commonalityco/data-packages';

export const getTagsData = cache(async () => {
  const packages = await getPackages({
    rootDirectory: process.env.COMMONALITY_ROOT_DIRECTORY,
  });

  return getTagsDatas({
    packages,
    rootDirectory: process.env.COMMONALITY_ROOT_DIRECTORY,
  });
});
