import {
  getPackageDirectories,
  getPackageManager,
  getWorkspaceGlobs,
} from '@commonalityco/data-project';
import path from 'node:path';
import fs from 'fs-extra';

type InvalidPackage = {
  path: string;
  reason: string;
};

export const getInvalidPackages = async ({
  rootDirectory,
}: {
  rootDirectory: string;
}): Promise<InvalidPackage> => {
  const packageManager = await getPackageManager({ rootDirectory });
  const workspaceGlobs = await getWorkspaceGlobs({
    rootDirectory,
    packageManager,
  });
  const packageDirectories = await getPackageDirectories({
    rootDirectory,
    workspaceGlobs,
  });

  const packageJsons = await Promise.all(
    packageDirectories.map(async (directory) => {
      const packageJsonPath = path.join(
        rootDirectory,
        directory,
        'package.json',
      );
      const packageJsonExists = await fs.pathExists(packageJsonPath);

      if (!packageJsonExists) {
        return;
      }

      const packageJson = fs.readJSONSync(packageJsonPath);

      if (!packageJson.name) {
        return;
      }

      return packageJson as InvalidPackage;
    }),
  );

  return packageJsons.filter(Boolean) as InvalidPackage[];
};
