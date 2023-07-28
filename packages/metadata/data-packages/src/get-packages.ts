import { Package, PackageJson } from '@commonalityco/types';
import {
  getPackageDirectories,
  getWorkspaceGlobs,
  getPackageManager,
} from '@commonalityco/data-project';
import fs from 'fs-extra';
import { DependencyType } from '@commonalityco/utils-core';
import path from 'path';

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

  const allDependencies = [
    ...formattedDependencies,
    ...formattedDevelopmentDependencies,
    ...formattedPeerDependencies,
  ];

  return {
    name: packageJson.name,
    description: packageJson.description,
    path: directory,
    version: packageJson.version ?? '',
    dependencies: allDependencies,
  };
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

  const packageResults = await Promise.all(
    packageDirectories.map((directory) => {
      return getPackage({
        rootDirectory,
        directory,
      });
    })
  );

  const localPackageNames = new Set(packageResults.map((pkg) => pkg.name));

  return packageResults.map((pkg) => ({
    ...pkg,
    dependencies: pkg.dependencies.filter((dep) =>
      localPackageNames.has(dep.name)
    ),
  }));
};
