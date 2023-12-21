import path from 'node:path';
import fs from 'fs-extra';
import type { PackageConfig, PackageJson } from '@commonalityco/types';
import { uniq } from 'lodash-es';
import { getPackageDirectories } from '@commonalityco/data-project/get-package-directories';
import { getWorkspaceGlobs } from '@commonalityco/data-project/get-workspace-globs';
import { getPackageManager } from '@commonalityco/data-project/get-package-manager';

export const setTags = async ({
  packageName,
  tags,
  rootDirectory,
}: {
  packageName: string;
  tags: string[];
  rootDirectory: string;
}): Promise<string[]> => {
  const packageManager = await getPackageManager({ rootDirectory });
  const workspaceGlobs = await getWorkspaceGlobs({
    rootDirectory,
    packageManager,
  });
  const packageDirectories = await getPackageDirectories({
    workspaceGlobs,
    rootDirectory,
  });

  //  TODO: Looping through every package and reading it is expensive, update this to be a mapping of directory to package.json contents.
  for (const directory of packageDirectories) {
    const packageJsonPath = path.join(rootDirectory, directory, 'package.json');

    if (!fs.existsSync(packageJsonPath)) {
      continue;
    }

    const packageJson = fs.readJSONSync(packageJsonPath) as PackageJson;

    if (packageJson.name !== packageName) {
      continue;
    }

    const packageConfigPath = path.join(
      rootDirectory,
      directory,
      'commonality.json',
    );

    if (!fs.existsSync(packageConfigPath)) {
      await fs.writeJSON(packageConfigPath, {});
    }

    const packageConfig = fs.readJSONSync(packageConfigPath) as PackageConfig;

    fs.writeJSONSync(packageConfigPath, {
      ...packageConfig,
      tags: [...new Set(tags)],
    });
  }

  return uniq(tags);
};
