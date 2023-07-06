import { Package, PackageJson } from '@commonalityco/types';
import chalk from 'chalk';
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

  const packageJson = fs.readJSONSync(packageJsonPath) as PackageJson;

  if (!packageJson.name) {
    console.log(chalk.red(`Packages must define a name property`));
    console.log(chalk.dim(directory));
    process.exit(1);
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
