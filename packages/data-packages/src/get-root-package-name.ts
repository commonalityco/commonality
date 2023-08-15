import { PackageJson } from '@commonalityco/types';
import path from 'node:path';
import fs from 'fs-extra';

export const getRootPackageName = async ({
  rootDirectory,
}: {
  rootDirectory: string;
}): Promise<string> => {
  const packageJsonPath = path.join(rootDirectory, 'package.json');

  const exists = await fs.pathExists(packageJsonPath);

  if (!exists) {
    throw new Error('Missing root package.json');
  }

  const packageJson: PackageJson = await fs.readJson(packageJsonPath);

  if (!packageJson.name) {
    throw new Error('Missing name in root package.json');
  }

  return packageJson.name;
};
