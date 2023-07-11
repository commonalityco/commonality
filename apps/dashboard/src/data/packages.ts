'use server';
import { cache } from 'react';
import 'server-only';
import {
  getPackageDirectories,
  getPackageManager,
  getWorkspaceGlobs,
} from '@commonalityco/data-project';
import { getPackages } from '@commonalityco/data-packages';

export const getPackageDirectoriesData = cache(async () => {
  const packageManager = await getPackageManager({
    rootDirectory: process.env.COMMONALITY_ROOT_DIRECTORY,
  });
  const workspaceGlobs = await getWorkspaceGlobs({
    rootDirectory: process.env.COMMONALITY_ROOT_DIRECTORY,
    packageManager,
  });

  return getPackageDirectories({
    rootDirectory: process.env.COMMONALITY_ROOT_DIRECTORY,
    workspaceGlobs,
  });
});

export const getPackagesData = async () => {
  const packagesData = await getPackages({
    rootDirectory: process.env.COMMONALITY_ROOT_DIRECTORY,
  });

  return packagesData;
};
