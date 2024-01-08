import path from 'node:path';
import fs from 'fs-extra';
import { Package, PackageConfig } from '@commonalityco/types';

export const setTags = async ({
  tags,
  pkg,
  rootDirectory,
}: {
  rootDirectory: string;
  tags: string[];
  pkg: Package;
}): Promise<string> => {
  const packageConfigPath = path.join(
    rootDirectory,
    pkg.path,
    'commonality.json',
  );

  const packageConfigExists = await fs.pathExists(packageConfigPath);

  if (!packageConfigExists) {
    await fs.writeJSON(packageConfigPath, {});
  }

  const packageConfig = fs.readJSONSync(packageConfigPath) as PackageConfig;

  fs.writeJSONSync(packageConfigPath, {
    ...packageConfig,
    tags: [...new Set(tags)],
  });

  return packageConfigPath;
};
