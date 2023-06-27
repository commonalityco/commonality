import path from 'node:path';
import fs from 'fs-extra';
import type { PackageConfig } from '@commonalityco/types';
import uniq from 'lodash.uniq';

export const getTags = async ({
  packageDirectories,
  rootDirectory,
}: {
  packageDirectories: string[];
  rootDirectory: string;
}) => {
  const tags: string[] = [];

  for (const directory of packageDirectories) {
    const packageConfigPath = path.join(
      rootDirectory,
      directory,
      'commonality.json'
    );

    if (!fs.existsSync(packageConfigPath)) {
      continue;
    }

    const packageConfig = fs.readJSONSync(packageConfigPath) as PackageConfig;

    if (packageConfig.tags && Array.isArray(packageConfig.tags)) {
      tags.push(...packageConfig.tags);
    }
  }

  return uniq(tags);
};
