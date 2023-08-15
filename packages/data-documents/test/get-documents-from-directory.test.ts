import { getDocumentsFromDirectory } from '../src/core/get-documents-from-directory.js';
import path from 'node:path';
import { Document } from '@commonalityco/types';
import { describe, it, expect } from 'vitest';
import { fileURLToPath } from 'node:url';

describe('getPagesFromDirectory', () => {
  it('should return documents for a package when they exist', async () => {
    const rootDirectory = path.join(
      path.dirname(fileURLToPath(import.meta.url)),
      './fixtures',
      'kitchen-sink',
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

  it('should return no documents for a package no markdown files exist', async () => {
    const rootDirectory = path.join(
      path.dirname(fileURLToPath(import.meta.url)),
      './fixtures',
      'no-documents',
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
