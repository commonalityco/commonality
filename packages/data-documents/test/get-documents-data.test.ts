import { getDocumentsData } from '../src/get-documents-data';
import path from 'node:path';
import { DocumentsData } from '@commonalityco/types';
import { describe, it, expect } from 'vitest';
import { fileURLToPath } from 'node:url';

describe('getDocumentsData', () => {
  it('should return documents when they exist', async () => {
    const rootDirectory = path.join(
      path.dirname(fileURLToPath(import.meta.url)),
      './fixtures',
      'kitchen-sink',
    );

    const documentsData = await getDocumentsData({ rootDirectory });

    const expectedDocumentsData = [
      {
        packageName: 'root',
        documents: [
          {
            filename: 'README',
            content: '# Root README\n',
            path: 'README.md',
            isRoot: true,
          },
        ],
      },
      {
        packageName: 'pkg-one',
        documents: [
          {
            filename: 'README',
            content: '# This is a title',
            path: 'packages/pkg-one/README.md',
            isRoot: false,
          },
          {
            content: '# Here is how to get started\n',
            filename: 'getting-started',
            path: 'packages/pkg-one/docs/getting-started.md',
            isRoot: false,
          },
        ],
      },
    ] satisfies DocumentsData[];

    expect(documentsData).toEqual(expectedDocumentsData);
  });

  it('should return a data with empty arrays if no documents are found', async () => {
    const rootDirectory = path.join(
      path.dirname(fileURLToPath(import.meta.url)),
      './fixtures',
      'no-documents',
    );

    const documentsData = await getDocumentsData({ rootDirectory });

    expect(documentsData).toEqual([
      {
        packageName: 'root',
        documents: [],
      },
      {
        packageName: 'pkg-one',
        documents: [],
      },
    ]);
  });

  it('should throw an error if the root directory does not exist', async () => {
    const rootDirectory = '/path/to/nonexistent/directory';

    await expect(getDocumentsData({ rootDirectory })).rejects.toThrow(
      'Could not detect package manager',
    );
  });
});
