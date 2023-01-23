import path from 'node:path';
import fs from 'fs-extra';

export const getPackageDirectories = async (
  rootDirectory: string,
  workspaceGlobs: string[]
): Promise<string[]> => {
  const { globby } = await import('globby');

  const directories = await globby(workspaceGlobs, {
    cwd: rootDirectory,
    onlyDirectories: true,
    expandDirectories: false,
    ignore: ['**/node_modules'],
  });

  const packageDirectoryPatterns = await Promise.all(
    directories.map((directory) => {
      const localPackageJsonPath = path.join(
        rootDirectory,
        directory,
        'package.json'
      );

      try {
        if (fs.pathExistsSync(localPackageJsonPath)) {
          return directory;
        }

        return;
      } catch {
        return;
      }
    })
  );

  return packageDirectoryPatterns.filter(Boolean) as string[];
};
