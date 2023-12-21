import type { Package, PackageJson } from '@commonalityco/types';
import path from 'node:path';
import fs from 'fs-extra';
import { PackageType } from '@commonalityco/utils-core';

const typeOrder = new Set([
  PackageType.NEXT,
  PackageType.REACT,
  PackageType.NODE,
]);

const DepNamesByPackageType = {
  [PackageType.REACT]: 'react',
  [PackageType.NEXT]: 'next',
};

const getType = (dependencies?: Record<string, string>) => {
  if (!dependencies) {
    return PackageType.NODE;
  }

  for (const type of typeOrder) {
    if (type === PackageType.NODE) {
      return PackageType.NODE;
    }

    const depName = DepNamesByPackageType[type];
    const matchingDepName = dependencies[depName];

    if (!matchingDepName) {
      continue;
    }

    return type;
  }

  return PackageType.NODE;
};

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
    type: getType(packageJson.dependencies),
    version: packageJson.version ?? '',
  } satisfies Package;
};
