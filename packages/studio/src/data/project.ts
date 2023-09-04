'use server';
import 'server-only';
import { getPackageManager } from '@commonalityco/data-project';
import { getRootPackageName } from '@commonalityco/data-packages';
import { PackageManager } from '@commonalityco/utils-core';

export const preload = () => {
  getProject();
};

export const getProject = async (): Promise<{
  name: string;
  packageManager: PackageManager;
}> => {
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
};
