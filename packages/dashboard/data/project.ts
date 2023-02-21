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
import path from 'path';
import fs from 'fs-extra';

export const preload = () => {
  void getProject();
};

export const getProject = cache(async () => {
  const rootDirectory = await getRootDirectory();
  const rootPackageJsonPath = path.join(rootDirectory, 'package.json');
  const rootPackageJson = fs.readJsonSync(rootPackageJsonPath);

  return {
    name: rootPackageJson.name,
  };
});
