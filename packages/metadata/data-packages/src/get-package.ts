import { Package, PackageJson } from '@commonalityco/types';
import path from 'path';
import fs from 'fs-extra';

export const getPackage = async ({
  rootDirectory,
  directory,
}: {
  rootDirectory: string;
  directory: string;
}): Promise<Package> => {
  const packageJsonPath = path.join(rootDirectory, directory, 'package.json');
  const packageJsonExists = await fs.pathExists(packageJsonPath);

  if (!packageJsonExists) {
    throw new Error('No package.json file for directory');
  }

  const packageJson = fs.readJSONSync(packageJsonPath) as PackageJson;

  if (!packageJson.name) {
    throw new Error(
      `${directory} has a package.json that does not contain a name property`
    );
  }

  return {
    name: packageJson.name,
    description: packageJson.description,
    path: directory,
    version: packageJson.version ?? '',
  } satisfies Package;
};
