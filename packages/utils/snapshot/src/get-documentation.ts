import { pathExists, readFileSync, readJsonSync } from 'fs-extra';
import path from 'node:path';
import { getPackageDirectories } from './get-package-directories';
import { getPackageManager } from './get-package-manager';
import { getRootDirectory } from './get-root-directory';
import { getWorkspaces } from './get-workspaces';

type PackageDocumentation = {
  readme?: string;
  //   docs: Array<{ filename: string; content: string }>;
};

export const getDocumentation = async () => {
  const documentationByPackageName: Record<string, PackageDocumentation> = {};

  const rootDirectory = await getRootDirectory();
  const packageManager = await getPackageManager(rootDirectory);
  const workspaceGlobs = await getWorkspaces(rootDirectory, packageManager);
  const packageDirectories = await getPackageDirectories(
    rootDirectory,
    workspaceGlobs
  );

  for (const directory of packageDirectories) {
    const documentation: PackageDocumentation = {};

    const readmePath = path.join(rootDirectory, directory, 'README.md');
    const readmeExists = await pathExists(readmePath);

    if (readmeExists) {
      documentation['readme'] = readFileSync(readmePath, 'utf8');
    }

    const packageJson = readJsonSync(
      path.join(rootDirectory, directory, 'package.json')
    );

    documentationByPackageName[packageJson.name] = documentation;
  }

  return documentationByPackageName;
};
