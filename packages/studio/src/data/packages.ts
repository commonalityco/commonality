'use server';
import 'server-only';
import { getPackages } from '@commonalityco/data-packages';
import { unstable_cache } from 'next/cache';
import { packagesKeys } from '@commonalityco/utils-graph/query-keys';

export const preload = () => {
  void getPackagesData();
};

export const getPackagesData = async () => {
  return unstable_cache(
    async () => {
      const packagesData = await getPackages({
        rootDirectory: process.env.COMMONALITY_ROOT_DIRECTORY,
      });

      return packagesData.sort((a, b) => a.name.localeCompare(b.name));
    },
    [`${process.env.COMMONALITY_ROOT_DIRECTORY}-packages`],
    {
      tags: packagesKeys,
    },
  )();
};
