import { Document } from '@commonalityco/types';
import fs from 'fs-extra';
import { globby } from 'globby';
import path from 'node:path';

export const getDocumentsFromDirectory = async ({
  rootDirectory,
  isRoot,
  directory,
}: {
  rootDirectory: string;
  isRoot: boolean;
  directory: string;
}): Promise<Document[]> => {
  let documentation: Document[] = [];

  const documentPaths = await globby(['*.md'], {
    cwd: path.join(rootDirectory, directory),
  });

  if (documentPaths.length > 0) {
    const documents = await Promise.all(
      documentPaths.map(async (documentPath) => {
        try {
          const fullPath = path.join(rootDirectory, directory, documentPath);
          const content = await fs.readFile(fullPath, 'utf8');
          const filename = path.basename(
            documentPath,
            path.extname(documentPath),
          );

          return {
            filename,
            isRoot,
            isReadme: filename === 'README',
            content,
          } satisfies Document;
        } catch {
          return;
        }
      }),
    );

    const filteredDocuments = documents.filter(
      (document) => document !== undefined,
    ) as Document[];

    documentation = [...documentation, ...filteredDocuments];
  }

  return documentation;
};
