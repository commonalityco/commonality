import type { Workspace } from '@commonalityco/types';
import fs from 'fs-extra';
import path from 'node:path';

export const getRootWorkspace = async ({
  rootDirectory,
}: {
  rootDirectory: string;
}): Promise<Workspace> => {
  const manifestPath = path.join(rootDirectory, 'package.json');
  const exists = await fs.pathExists(manifestPath);

  if (!exists) {
    throw new Error('No package.json found in root directory');
  }

  const packageJson = await fs.readJSON(
    path.join(rootDirectory, 'package.json'),
  );

  return {
    path: rootDirectory,
    relativePath: '.',
    packageJson,
  } satisfies Workspace;
};
