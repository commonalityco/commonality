import 'server-only';
import {
  getPackageManager,
  getRootDirectory,
} from '@commonalityco/data-project';
import path from 'path';
import fs from 'fs-extra';

export const preload = () => {
  void getProject();
};

export const getProject = async () => {
  const rootDirectory = await getRootDirectory();
  const packageManager = await getPackageManager({ rootDirectory });
  const rootPackageJsonPath = path.join(rootDirectory, 'package.json');
  const rootPackageJson = fs.readJsonSync(rootPackageJsonPath);

  return {
    name: rootPackageJson.name,
    packageManager,
  };
};
