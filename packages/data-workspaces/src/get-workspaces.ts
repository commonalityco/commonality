import { getTagsData } from '@commonalityco/data-tags';
import { getPackages } from '@commonalityco/data-packages';
import { getCodeownersData } from '@commonalityco/data-codeowners';
import {
  getPackageDirectories,
  getWorkspaceGlobs,
  getPackageManager,
} from '@commonalityco/data-project';
import type { Workspace } from '@commonalityco/types';
import fs from 'fs-extra';
import path from 'node:path';

export const getWorkspaces = async ({
  rootDirectory,
}: {
  rootDirectory: string;
}): Promise<Workspace[]> => {
  const packageManager = await getPackageManager({ rootDirectory });
  const workspaceGlobs = await getWorkspaceGlobs({
    rootDirectory,
    packageManager,
  });
  const packageDirectories = await getPackageDirectories({
    rootDirectory,
    workspaceGlobs,
  });
  const packages = await getPackages({ rootDirectory });
  const codeownersData = await getCodeownersData({ rootDirectory, packages });
  const tagsData = await getTagsData({ rootDirectory, packages });

  const workspacesResult = await Promise.all(
    packageDirectories
      .map(async (pkgDir) => {
        try {
          const packageJson = await fs.readJSON(
            path.join(rootDirectory, pkgDir, 'package.json'),
          );

          if (!packageJson.name) {
            return;
          }

          const tags: string[] =
            tagsData.find((data) => data.packageName === packageJson.name)
              ?.tags ?? [];
          const codeowners =
            codeownersData.find((data) => data.packageName === packageJson.name)
              ?.codeowners ?? [];

          return {
            path: pkgDir,
            codeowners,
            tags,
            packageJson,
          } satisfies Workspace;
        } catch {
          return false;
        }
      })
      .filter(Boolean),
  );

  return workspacesResult.filter(
    (workspace): workspace is Workspace => !!workspace,
  );
};
