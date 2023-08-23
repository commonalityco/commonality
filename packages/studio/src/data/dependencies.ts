'use server';
import 'server-only';
import { getDependencies } from '@commonalityco/data-packages';
import { unstable_cache } from 'next/cache';
import { dependenciesKeys } from '@commonalityco/utils-graph/query-keys';

export const getDependenciesData = async () => {
  return unstable_cache(
    async () => {
      return getDependencies({
        rootDirectory: process.env.COMMONALITY_ROOT_DIRECTORY,
      });
    },
    [`${process.env.COMMONALITY_ROOT_DIRECTORY}-dependencies`],
    {
      tags: dependenciesKeys,
    },
  )();
};
