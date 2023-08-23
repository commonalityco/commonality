'use server';
import 'server-only';
import { getPackageManager } from '@commonalityco/data-project';
import { getRootPackageName } from '@commonalityco/data-packages';
import { unstable_cache } from 'next/cache';
import { projectConfigKeys } from '@commonalityco/utils-graph/query-keys';
import { PackageManager } from '@commonalityco/utils-core';

export const preload = () => {
  getProject();
};

export const getProject = async (): Promise<{
  name: string;
  packageManager: PackageManager;
}> => {
  return unstable_cache(
    async () => {
      const packageManager = await getPackageManager({
        rootDirectory: process.env.COMMONALITY_ROOT_DIRECTORY,
      });
      const rootPackageName = await getRootPackageName({
        rootDirectory: process.env.COMMONALITY_ROOT_DIRECTORY,
      });

      return {
        name: rootPackageName,
        packageManager,
      };
    },
    [`${process.env.COMMONALITY_ROOT_DIRECTORY}-project`],
    {
      tags: projectConfigKeys,
    },
  )();
};
