import path from 'node:path';
import fs from 'fs-extra';
import type { Package, PackageConfig, TagsData } from '@commonalityco/types';

export const getTagsData = async ({
  rootDirectory,
  packages,
}: {
  rootDirectory: string;
  packages: Package[];
}): Promise<TagsData[]> => {
  const tagData: TagsData[] = [];

  for (const pkg of packages) {
    const packageConfigPath = path.join(
      rootDirectory,
      pkg.path,
      'commonality.json'
    );

    if (!fs.existsSync(packageConfigPath)) {
      continue;
    }

    const packageConfig = fs.readJSONSync(packageConfigPath) as PackageConfig;

    if (packageConfig.tags && Array.isArray(packageConfig.tags)) {
      tagData.push({
        packageName: pkg.name,
        tags: packageConfig.tags,
      });
    }
  }

  return tagData;
};
