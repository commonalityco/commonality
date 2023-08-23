'use server';
import 'server-only';
import { cache } from 'react';
import { getCodeownersData as getCodeownersDatas } from '@commonalityco/data-codeowners';
import { getPackages } from '@commonalityco/data-packages';
import { unstable_cache } from 'next/cache';
import { tagsKeys } from '@commonalityco/utils-graph/query-keys';

export const getCodeownersData = cache(async () => {
  const packages = await getPackages({
    rootDirectory: process.env.COMMONALITY_ROOT_DIRECTORY,
  });

  return unstable_cache(
    async () => {
      return getCodeownersDatas({
        rootDirectory: process.env.COMMONALITY_ROOT_DIRECTORY,
        packages,
      });
    },
    [`${process.env.COMMONALITY_ROOT_DIRECTORY}-codeowners`],
    {
      tags: tagsKeys,
    },
  )();
});
