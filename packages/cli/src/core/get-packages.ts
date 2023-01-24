import path from 'node:path';
import fs from 'fs-extra';
import type { Package, PackageConfig, PackageJson } from '@commonalityco/types';
import Codeowners from 'codeowners';

const getCodeowners = (rootDirectory: string) => {
  try {
    const file = new Codeowners(rootDirectory);
    return file;
  } catch {
    return;
  }
};

export const getPackages = async ({
  packageDirectories,
  rootDirectory,
}: {
  packageDirectories: string[];
  rootDirectory: string;
}) => {
  const packagesWithTags: Package[] = [];
  const codeowners = getCodeowners(rootDirectory);

  for (const directory of packageDirectories) {
    const packageJsonPath = path.join(rootDirectory, directory, 'package.json');

    const packageConfigPath = path.join(
      rootDirectory,
      directory,
      'commonality.json'
    );

    const packageJson = fs.readJSONSync(packageJsonPath) as PackageJson;

    const dependencies = packageJson.dependencies ?? {};
    const devDependencies = packageJson.devDependencies ?? {};
    const peerDependencies = packageJson.peerDependencies ?? {};

    const formattedDependencies = Object.entries(dependencies).map(
      ([name, version]) => ({ name, version })
    );
    const formattedDevelopmentDependencies = Object.entries(
      devDependencies
    ).map(([name, version]) => ({ name, version }));
    const formattedPeerDependencies = Object.entries(peerDependencies).map(
      ([name, version]) => ({ name, version })
    );

    const packageOwners = codeowners ? codeowners.getOwner(directory) : [];

    if (!fs.pathExistsSync(packageConfigPath)) {
      if (packageJson.name) {
        packagesWithTags.push({
          name: packageJson.name,
          path: directory,
          version: packageJson.version ?? '',
          tags: [],
          devDependencies: formattedDevelopmentDependencies,
          dependencies: formattedDependencies,
          peerDependencies: formattedPeerDependencies,
          owners: packageOwners,
        });
      }

      continue;
    }

    const packageConfig = fs.readJSONSync(packageConfigPath) as PackageConfig;

    if (packageJson.name) {
      packagesWithTags.push({
        name: packageJson.name,
        path: directory,
        version: packageJson.version ?? '',
        tags: packageConfig.tags ?? [],
        devDependencies: formattedDevelopmentDependencies,
        dependencies: formattedDependencies,
        peerDependencies: formattedPeerDependencies,
        owners: packageOwners,
      });
    }
  }

  return packagesWithTags;
};
