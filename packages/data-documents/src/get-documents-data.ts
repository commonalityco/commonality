import { pathExists, readJsonSync } from 'fs-extra';
import path from 'node:path';
import { DocumentsData } from '@commonalityco/types';
import {
  getPackageDirectories,
  getPackageManager,
  getWorkspaceGlobs,
} from '@commonalityco/data-project';
import { getDocumentsFromDirectory } from './core/get-documents-from-directory';

export const getDocumentsData = async ({
  rootDirectory,
}: {
  rootDirectory: string;
}): Promise<DocumentsData[]> => {
  const documentData: DocumentsData[] = [];
  const packageManager = await getPackageManager({ rootDirectory });
  const workspaceGlobs = await getWorkspaceGlobs({
    rootDirectory,
    packageManager,
  });
  const packageDirectories = await getPackageDirectories({
    rootDirectory,
    workspaceGlobs,
  });

  const rootDocumentation = await getDocumentsFromDirectory({
    rootDirectory,
    isRoot: true,
    directory: './',
  });

  const rootPackageJsonPath = path.join(rootDirectory, 'package.json');
  const rootPackageJsonExists = await pathExists(rootPackageJsonPath);

  if (rootPackageJsonExists) {
    const rootPackageJson = readJsonSync(rootPackageJsonPath);

    documentData.push({
      packageName: rootPackageJson.name,
      documents: rootDocumentation,
    });
  }

  for (const directory of packageDirectories) {
    const documents = await getDocumentsFromDirectory({
      rootDirectory,
      isRoot: false,
      directory,
    });

    const packageJson = readJsonSync(
      path.join(rootDirectory, directory, 'package.json')
    );

    documentData.push({
      packageName: packageJson.name,
      documents,
    });
  }

  return documentData;
};
