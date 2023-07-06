'use server';
import { cache } from 'react';
import 'server-only';
import {
  getPackageDirectories,
  getPackageManager,
  getRootDirectory,
  getWorkspaceGlobs,
} from '@commonalityco/data-project';
import { getPackages } from '@commonalityco/data-packages';

export const getRootDirectoryData = cache(async () => {
  return getRootDirectory();
});

export const getPackageDirectoriesData = cache(async () => {
  const rootDirectory = await getRootDirectoryData();
  const packageManager = await getPackageManager({ rootDirectory });
  const workspaceGlobs = await getWorkspaceGlobs({
    rootDirectory,
    packageManager,
  });

  return getPackageDirectories({ rootDirectory, workspaceGlobs });
});

export const getPackagesData = async () => {
  const rootDirectory = await getRootDirectoryData();

  const packagesData = await getPackages({ rootDirectory });

  return packagesData;
};
