import { pathExists, readFile, readJsonSync } from 'fs-extra';
import globby from 'globby';
import path from 'node:path';
import { Document } from '@commonalityco/types';
import { getPackageDirectories } from './get-package-directories';
import { getPackageManager } from './get-package-manager';
import { getRootDirectory } from './get-root-directory';
import { getWorkspaces } from './get-workspaces';

export const getPagesFromDirectory = async ({
  rootDirectory,
  directory,
}: {
  rootDirectory: string;
  directory: string;
}): Promise<Document[]> => {
  let documentation: Document[] = [];

  const documentPaths = await globby(['docs/**/*.md'], {
    cwd: path.join(rootDirectory, directory),
  });

  if (documentPaths.length > 0) {
    const documents = await Promise.all(
      documentPaths.map(async (documentPath) => {
        try {
          const fullPath = path.join(rootDirectory, documentPath);
          const content = await readFile(fullPath, 'utf8');
          const filename = path.basename(
            documentPath,
            path.extname(documentPath)
          );

          return {
            filename,
            content,
          };
        } catch {
          return;
        }
      })
    );

    const filteredDocuments = documents.filter(
      (document): document is Document => document !== undefined
    );

    documentation = [...documentation, ...filteredDocuments];
  }

  return documentation;
};

export const getReadmeFromDirectory = async ({
  directory = './',
}): Promise<Document | undefined> => {
  const rootDirectory = await getRootDirectory();

  const readmePath = path.join(rootDirectory, directory, 'README.md');
  const readmeExists = await pathExists(readmePath);

  if (readmeExists) {
    const content = await readFile(readmePath, 'utf8');

    return { filename: 'README', content };
  }

  return undefined;
};

export const getAllPages = async () => {
  const documentationByPackageName: Record<string, Document[]> = {};

  const rootDirectory = await getRootDirectory();
  const packageManager = await getPackageManager(rootDirectory);
  const workspaceGlobs = await getWorkspaces(rootDirectory, packageManager);
  const packageDirectories = await getPackageDirectories(
    rootDirectory,
    workspaceGlobs
  );

  const rootDocumentation = await getPagesFromDirectory({
    rootDirectory,
    directory: './',
  });

  const rootPackageJson = readJsonSync(
    path.join(rootDirectory, 'package.json')
  );

  documentationByPackageName[rootPackageJson.name] = rootDocumentation;

  for (const directory of packageDirectories) {
    const documentation = await getPagesFromDirectory({
      rootDirectory,
      directory,
    });

    const packageJson = readJsonSync(
      path.join(rootDirectory, directory, 'package.json')
    );

    documentationByPackageName[packageJson.name] = documentation;
  }

  return documentationByPackageName;
};
