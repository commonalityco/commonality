import { Package, PackageJson } from '@commonalityco/types';
import path from 'node:path';
import fs from 'fs-extra';
import { BlockType } from '@commonalityco/utils-core/constants';

const typeOrder = new Set([BlockType.NEXT, BlockType.REACT, BlockType.NODE]);

const DepNamesByPackageType = {
  [BlockType.REACT]: 'react',
  [BlockType.NEXT]: 'next',
};

const getType = (dependencies?: Record<string, string>) => {
  if (!dependencies) {
    return BlockType.NODE;
  }

  for (const type of typeOrder) {
    if (type === BlockType.NODE) {
      return BlockType.NODE;
    }

    const depName = DepNamesByPackageType[type];
    const matchingDepName = dependencies[depName];

    if (!matchingDepName) {
      continue;
    }

    return type;
  }

  return BlockType.NODE;
};

export const getPackage = async ({
  rootDirectory,
  directory,
}: {
  rootDirectory: string;
  directory: string;
}): Promise<Package | undefined> => {
  const packageJsonPath = path.join(rootDirectory, directory, 'package.json');
  const packageJsonExists = await fs.pathExists(packageJsonPath);

  if (!packageJsonExists) {
    return;
  }

  const packageJson = fs.readJSONSync(packageJsonPath) as PackageJson;

  if (!packageJson.name) {
    return;
  }

  const getIsPrivate = () => {
    if (packageJson.private === true) {
      return true;
    }
    if (packageJson.publishConfig?.access === 'restricted') {
      return true;
    }
    if (packageJson?.name?.startsWith('@')) {
      // Scoped packages default to private
      return packageJson.private !== false;
    }
    // Unscoped packages default to public
    return packageJson.private ?? false;
  };

  return {
    name: packageJson.name,
    description: packageJson.description,
    path: directory,
    type: getType({
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    }),
    version: packageJson.version ?? '',
    churn: 0.3,
    complexity: 0.3,
    license: packageJson.license,
    private: getIsPrivate(),
  } satisfies Package;
};
