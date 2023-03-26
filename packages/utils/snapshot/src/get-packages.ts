import path from 'node:path';
import fs from 'fs-extra';
import {
  DependencyType,
  Package,
  PackageConfig,
  PackageJson,
} from '@commonalityco/types';
import { getCodeowners, getOwnersForPath } from '@commonalityco/codeowners';
import chalk from 'chalk';

const getPackage = ({
  rootDirectory,
  directory,
  codeowners,
}: {
  rootDirectory: string;
  directory: string;
  codeowners: Record<string, string[]>;
}): Package => {
  const packageJsonPath = path.join(rootDirectory, directory, 'package.json');

  const packageConfigPath = path.join(
    rootDirectory,
    directory,
    'commonality.json'
  );

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

  const packageOwners = getOwnersForPath({ path: directory, codeowners });

  const packageConfigExists = fs.pathExistsSync(packageConfigPath);

  if (packageConfigExists) {
    const packageConfig = fs.readJSONSync(packageConfigPath) as PackageConfig;

    return {
      name: packageJson.name,
      path: directory,
      version: packageJson.version ?? '',
      tags: packageConfig.tags ?? [],
      devDependencies: formattedDevelopmentDependencies,
      dependencies: formattedDependencies,
      peerDependencies: formattedPeerDependencies,
      owners: packageOwners,
    };
  } else {
    return {
      name: packageJson.name,
      path: directory,
      version: packageJson.version ?? '',
      tags: [],
      devDependencies: formattedDevelopmentDependencies,
      dependencies: formattedDependencies,
      peerDependencies: formattedPeerDependencies,
      owners: packageOwners,
    };
  }
};

export const getRootPackage = async ({
  rootDirectory,
}: {
  rootDirectory: string;
}) => {
  return getPackage({
    rootDirectory,
    directory: './',
    codeowners: {},
  });
};

export const getPackages = async ({
  packageDirectories,
  rootDirectory,
}: {
  packageDirectories: string[];
  rootDirectory: string;
}) => {
  const codeowners = getCodeowners({ rootDirectory });
  const packages: Package[] = [];

  for (const directory of packageDirectories) {
    const package_ = getPackage({
      rootDirectory,
      directory,
      codeowners,
    });

    packages.push(package_);
  }

  return packages;
};
