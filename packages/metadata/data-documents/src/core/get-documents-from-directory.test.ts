import { getDocumentsFromDirectory } from './get-documents-from-directory';
import path from 'path';
import { Document } from '@commonalityco/types';

describe('getPagesFromDirectory', () => {
  it('should return documents for a package when they exist', async () => {
    const rootDirectory = path.join(
      __dirname,
      '../../test/fixtures',
      'kitchen-sink'
    );

    const documents = await getDocumentsFromDirectory({
      rootDirectory,
      isRoot: false,
      directory: 'packages/pkg-one',
    });

    const expectedDocuments = [
      {
        filename: 'README',
        content: '# This is a title',
        isReadme: true,
        isRoot: false,
      },
    ] satisfies Document[];

    expect(documents).toEqual(expectedDocuments);
  });
  2;

  it('should return no documents for a package no markdown files exist', async () => {
    const rootDirectory = path.join(
      __dirname,
      '../../test/fixtures',
      'no-documents'
    );

    const documents = await getDocumentsFromDirectory({
      rootDirectory,
      isRoot: false,
      directory: 'packages/pkg-one',
    });

    const expectedDocuments = [] satisfies Document[];

    expect(documents).toEqual(expectedDocuments);
  });
});
