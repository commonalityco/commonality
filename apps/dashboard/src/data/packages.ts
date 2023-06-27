import { cache } from 'react';
import 'server-only';
import {
  getPackageDirectories,
  getPackageManager,
  getPackages,
  getRootDirectory,
  getRootPackage,
  getWorkspaces,
} from '@commonalityco/snapshot';

export const getRootDirectoryData = cache(async () => {
  return getRootDirectory();
});

export const getPackageDirectoriesData = cache(async () => {
  const rootDirectory = await getRootDirectoryData();
  const packageManager = await getPackageManager(rootDirectory);
  const workspaceGlobs = await getWorkspaces(rootDirectory, packageManager);

  return getPackageDirectories(rootDirectory, workspaceGlobs);
});

export const getPackagesData = async () => {
  const rootDirectory = await getRootDirectoryData();
  const packageDirectories = await getPackageDirectoriesData();

  const packagesData = await getPackages({ rootDirectory });

  return packagesData;
};

export const getRootPackageData = cache(async () => {
  const rootDirectory = await getRootDirectoryData();

  return getRootPackage({ rootDirectory });
});
