import path from 'node:path';
import fs from 'fs-extra';
import type { Package, PackageConfig, TagsData } from '@commonalityco/types';
import { slugifyTagName } from '@commonalityco/utils-core';

export const getTagsData = async ({
  rootDirectory,
  packages,
}: {
  rootDirectory: string;
  packages: Package[];
}): Promise<TagsData[]> => {
  const tagData: TagsData[] = [];

  await Promise.all(
    packages.map(async (pkg) => {
      const packageConfigPath = path.join(
        rootDirectory,
        pkg.path,
        'commonality.json'
      );

      if (!(await fs.exists(packageConfigPath))) {
        return;
      }

      const packageConfig: PackageConfig = await fs.readJSON(packageConfigPath);

      if (packageConfig.tags && Array.isArray(packageConfig.tags)) {
        const formattedTags = packageConfig.tags
          .map((tag) => slugifyTagName(tag))
          .filter(Boolean);

        tagData.push({
          packageName: pkg.name,
          tags: formattedTags,
        });
      }
    })
  );

  return tagData;
};
