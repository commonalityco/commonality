import { getDocumentsData } from './get-documents-data';
import path from 'path';
import { DocumentsData } from '@commonalityco/types';
import { describe, it, expect } from 'vitest';

describe('getDocumentsData', () => {
  it('should return documents when they exist', async () => {
    const rootDirectory = path.join(
      __dirname,
      '../test/fixtures',
      'kitchen-sink'
    );

    const documentsData = await getDocumentsData({ rootDirectory });

    const expectedDocumentsData = [
      {
        packageName: 'root',
        documents: [
          {
            filename: 'README',
            content: '# Root README',
            isReadme: true,
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
            isReadme: true,
            isRoot: false,
          },
        ],
      },
    ] satisfies DocumentsData[];

    expect(documentsData).toEqual(expectedDocumentsData);
  });

  it('should return a data with empty arrays if no documents are found', async () => {
    const rootDirectory = path.join(
      __dirname,
      '../test/fixtures',
      'no-documents'
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
      'Could not detect package manager'
    );
  });
});
