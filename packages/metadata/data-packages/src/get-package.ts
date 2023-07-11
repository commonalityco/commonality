import { Package, PackageJson } from '@commonalityco/types';
import fs from 'fs-extra';
import path from 'node:path';
import { DependencyType } from '@commonalityco/utils-core';

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

  const dependencies = packageJson.dependencies ?? {};
  const devDependencies = packageJson.devDependencies ?? {};
  const peerDependencies = packageJson.peerDependencies ?? {};

  const formattedDependencies = Object.entries(dependencies).map(
    ([name, version]) => ({ name, version, type: DependencyType.PRODUCTION })
  );
  const formattedDevelopmentDependencies = Object.entries(devDependencies).map(
    ([name, version]) => ({
      name,
      version,
      type: DependencyType.DEVELOPMENT,
    })
  );

  const formattedPeerDependencies = Object.entries(peerDependencies).map(
    ([name, version]) => ({ name, version, type: DependencyType.PEER })
  );

  return {
    name: packageJson.name,
    description: packageJson.description,
    path: directory,
    version: packageJson.version ?? '',
    devDependencies: formattedDevelopmentDependencies,
    dependencies: formattedDependencies,
    peerDependencies: formattedPeerDependencies,
  };
};
