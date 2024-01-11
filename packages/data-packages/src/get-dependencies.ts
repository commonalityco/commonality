import {
  getPackageDirectories,
  getPackageManager,
  getWorkspaceGlobs,
} from '@commonalityco/data-project';
import path from 'node:path';
import fs from 'fs-extra';
import { DependencyType } from '@commonalityco/utils-core';
import { Dependency, PackageJson } from '@commonalityco/types';

type PackageJsonWithName = PackageJson & { name: string };

const getPackageJsons = async ({
  rootDirectory,
}: {
  rootDirectory: string;
}): Promise<PackageJsonWithName[]> => {
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
    packageDirectories.map(async (directory) => {
      const packageJsonPath = path.join(
        rootDirectory,
        directory,
        'package.json',
      );
      const packageJsonExists = await fs.pathExists(packageJsonPath);

      if (!packageJsonExists) {
        throw new Error('No package.json file for directory');
      }

      const packageJson = fs.readJSONSync(packageJsonPath);

      if (!packageJson.name) {
        throw new Error(
          `${directory} has a package.json that does not contain a name property`,
        );
      }

      return packageJson as PackageJsonWithName;
    }),
  );
};

export const getDependencies = async ({
  rootDirectory,
}: {
  rootDirectory: string;
}): Promise<Dependency[]> => {
  const packageJsons = await getPackageJsons({ rootDirectory });

  const localPackageNames = new Set(
    packageJsons.map((packageJson) => packageJson.name),
  );

  return packageJsons.flatMap((packageJson) => {
    const formatDep =
      (type: DependencyType) =>
      (entry: [dependencyName: string, version: string]) => {
        if (!localPackageNames.has(entry[0])) {
          return;
        }

        return {
          version: entry[1],
          source: packageJson.name,
          target: entry[0],
          type,
        } satisfies Dependency;
      };

    const dependencies = Object.entries(packageJson.dependencies ?? {})
      .map(formatDep(DependencyType.PRODUCTION))
      .filter((dep): dep is Dependency => !!dep);
    const devDependencies = Object.entries(packageJson.devDependencies ?? {})
      .map(formatDep(DependencyType.DEVELOPMENT))
      .filter((dep): dep is Dependency => !!dep);
    const peerDependencies = Object.entries(packageJson.peerDependencies ?? {})
      .map(formatDep(DependencyType.PEER))
      .filter((dep): dep is Dependency => !!dep);

    return [
      ...dependencies,
      ...devDependencies,
      ...peerDependencies,
    ] satisfies Dependency[];
  });
};
