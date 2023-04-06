import { cache } from 'react';
import 'server-only';
import { getRootDirectory } from '@commonalityco/snapshot';
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
