'use server';
import 'server-only';
import { getPackageManager } from '@commonalityco/data-project/get-package-manager';
import { getRootPackageName } from '@commonalityco/data-packages';
import { getProjectConfig } from '@commonalityco/data-project';

export const preload = () => {
  getProjectData();
};

export const getProjectData = async () => {
  const packageManager = await getPackageManager({
    rootDirectory: process.env.COMMONALITY_ROOT_DIRECTORY,
  });
  const rootPackageName = await getRootPackageName({
    rootDirectory: process.env.COMMONALITY_ROOT_DIRECTORY,
  });
  const config = await getProjectConfig({
    rootDirectory: process.env.COMMONALITY_ROOT_DIRECTORY,
  });

  return {
    name: rootPackageName,
    packageManager,
    config,
  };
};
