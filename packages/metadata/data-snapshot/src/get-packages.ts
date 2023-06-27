import { Package, PackageConfig, PackageJson } from '@commonalityco/types';
import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'node:path';
import { DependencyType } from '@commonalityco/utils-core';
import {
  getPagesFromDirectory,
  getReadmeFromDirectory,
} from './get-documentation';
import {
  getPackageDirectories,
  getWorkspaceGlobs,
  getPackageManager,
} from '@commonalityco/data-project';

const getPackage = async ({
  rootDirectory,
  directory,
}: {
  rootDirectory: string;
  directory: string;
}): Promise<Package> => {
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

  const packageConfigExists = fs.pathExistsSync(packageConfigPath);

  const readme = await getReadmeFromDirectory({
    directory,
  });

  const pages = await getPagesFromDirectory({
    rootDirectory,
    directory,
  });

  if (packageConfigExists) {
    const packageConfig = fs.readJSONSync(packageConfigPath) as PackageConfig;

    return {
      name: packageJson.name,
      description: packageJson.description,
      path: directory,
      version: packageJson.version ?? '',
      tags: packageConfig.tags ?? [],
      devDependencies: formattedDevelopmentDependencies,
      dependencies: formattedDependencies,
      peerDependencies: formattedPeerDependencies,
      docs: {
        readme,
        pages,
      },
    };
  } else {
    return {
      name: packageJson.name,
      description: packageJson.description,
      path: directory,
      version: packageJson.version ?? '',
      tags: [],
      devDependencies: formattedDevelopmentDependencies,
      dependencies: formattedDependencies,
      peerDependencies: formattedPeerDependencies,
      docs: {
        readme,
        pages,
      },
    };
  }
};

export const getRootPackage = async ({
  rootDirectory,
}: {
  rootDirectory: string;
}): Promise<Package> => {
  return await getPackage({
    rootDirectory,
    directory: './',
  });
};

export const getPackages = async ({
  rootDirectory,
}: {
  rootDirectory: string;
}): Promise<Package[]> => {
  const packageManager = await getPackageManager({ rootDirectory });
  const workspaceGlobs = await getWorkspaceGlobs({
    rootDirectory,
    packageManager,
  });
  const packageDirectories = await getPackageDirectories({
    rootDirectory,
    workspaceGlobs,
  });

  return Promise.all(
    packageDirectories.map((directory) => {
      return getPackage({
        rootDirectory,
        directory,
      });
    })
  );
};
