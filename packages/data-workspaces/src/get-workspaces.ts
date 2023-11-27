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

          return {
            path: path.join(rootDirectory, pkgDir),
            relativePath: pkgDir,
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
