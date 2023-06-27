import path from 'node:path';
import fs from 'fs-extra';
import globby from 'globby';

export const getPackageDirectories = async ({
  rootDirectory,
  workspaceGlobs,
}: {
  rootDirectory: string;
  workspaceGlobs: string[];
}): Promise<string[]> => {
  const directories = await globby(workspaceGlobs, {
    cwd: rootDirectory,
    onlyDirectories: true,
    expandDirectories: false,
    ignore: ['**/node_modules'],
  });

  const packageDirectoryPatterns = await Promise.all(
    directories.map((directory: string) => {
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
