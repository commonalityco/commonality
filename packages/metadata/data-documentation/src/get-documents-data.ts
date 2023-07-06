import { pathExists, readFile, readJsonSync } from 'fs-extra';
import globby from 'globby';
import path from 'node:path';
import { Document, DocumentsData } from '@commonalityco/types';
import {
  getPackageDirectories,
  getPackageManager,
  getRootDirectory,
  getWorkspaceGlobs,
} from '@commonalityco/data-project';

const getPagesFromDirectory = async ({
  rootDirectory,
  isRoot,
  directory,
}: {
  rootDirectory: string;
  isRoot: boolean;
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
            isRoot,
            isReadme: false,
            content,
          } satisfies Document;
        } catch {
          return;
        }
      })
    );

    const filteredDocuments = documents.filter(
      (document) => document !== undefined
    ) as Document[];

    documentation = [...documentation, ...filteredDocuments];
  }

  return documentation;
};

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

  const rootDocumentation = await getPagesFromDirectory({
    rootDirectory,
    isRoot: true,
    directory: './',
  });

  const rootPackageJson = readJsonSync(
    path.join(rootDirectory, 'package.json')
  );

  documentData.push({
    packageName: rootPackageJson.name,
    documents: rootDocumentation,
  });

  for (const directory of packageDirectories) {
    const documents = await getPagesFromDirectory({
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
