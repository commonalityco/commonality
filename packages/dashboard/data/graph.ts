import { cache } from 'react';
import 'server-only';
import {
  getPackageDirectories,
  getPackageManager,
  getPackages,
  getRootDirectory,
  getWorkspaces,
} from '@commonalityco/snapshot';
import { getGraphLayout } from '@/utils/getGraphLayout';

export const preload = () => {
  void getElements();
};

export const getElements = cache(async () => {
  const rootDirectory = await getRootDirectory();
  const packageManager = await getPackageManager(rootDirectory);
  const workspaceGlobs = await getWorkspaces(rootDirectory, packageManager);
  const packageDirectories = await getPackageDirectories(
    rootDirectory,
    workspaceGlobs
  );
  const packages = await getPackages({ rootDirectory, packageDirectories });

  return getGraphLayout(packages);
});
