'use server';
import 'server-only';
import { cache } from 'react';
import { getTagsData as getTagsDatas } from '@commonalityco/data-tags';
import { getPackages } from '@commonalityco/data-packages';
import { unstable_cache } from 'next/cache';
import { tagsKeys } from '@commonalityco/utils-graph/query-keys';

export const getTagsData = cache(async () => {
  return unstable_cache(
    async () => {
      const packages = await getPackages({
        rootDirectory: process.env.COMMONALITY_ROOT_DIRECTORY,
      });

      return getTagsDatas({
        packages,
        rootDirectory: process.env.COMMONALITY_ROOT_DIRECTORY,
      });
    },
    [`${process.env.COMMONALITY_ROOT_DIRECTORY}-tags`],
    {
      tags: tagsKeys,
    },
  )();
});
