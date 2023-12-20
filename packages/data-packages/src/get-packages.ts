import type { Package } from '@commonalityco/types';
import {
  getPackageDirectories,
  getWorkspaceGlobs,
  getPackageManager,
} from '@commonalityco/data-project';
import { getPackage } from './get-package';

export const getPackages = async ({
  rootDirectory,
}: {
  rootDirectory: string;
}): Promise<Package[]> => {
  const packageManager = await getPackageManager({ rootDirectory });
  const workspaceGlobs = await getWorkspaceGlobs({
    rootDirectory,
    packageManager,
  });
  const packageDirectories = await getPackageDirectories({
    rootDirectory,
    workspaceGlobs,
  });

  if (packageDirectories.length === 0) {
    return [
      await getPackage({
        rootDirectory,
        directory: '.',
      }),
    ];
  }

  const packageResults = await Promise.all(
    packageDirectories.map((directory) => {
      return getPackage({
        rootDirectory,
        directory,
      });
    }),
  );

  return packageResults;
};
