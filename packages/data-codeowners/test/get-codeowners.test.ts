/* eslint-disable @typescript-eslint/naming-convention */
import path from 'node:path';
import { getCodeowners } from '../src/core/get-codeowners.js';
import { describe, it, expect } from 'vitest';
import { fileURLToPath } from 'node:url';

describe('getCodeOwners', () => {
  describe('when the file is at the root of the repo', () => {
    it('returns an object containing the correct owners for each glob', async () => {
      const rootDirectory = path.resolve(
        path.dirname(fileURLToPath(import.meta.url)),
        './fixtures/github-example',
      );
      const ownership = await getCodeowners({ rootDirectory });

      expect(ownership).toEqual({
        '**': ['@global-owner1', '@global-owner2'],
        '**/*.js': ['@js-owner'],
        '**/*.go': ['docs@example.com'],
        '**/*.txt': ['@octo-org/octocats'],
        'build/logs/**': ['@doctocat'],
        '**/docs/*': ['docs@example.com'],
        '**/apps/**': ['@octocat'],
        'docs/**': ['@doctocat'],
        'scripts/**': ['@doctocat', '@octocat'],
        'apps/**': ['@octocat'],
        'apps/github/*': [],
      });
    });
  });

  describe('when there is no CODEOWNERS file', () => {
    it('returns an empty object', async () => {
      const ownership = await getCodeowners({
        rootDirectory: path.resolve(
          path.dirname(fileURLToPath(import.meta.url)),
          './fixtures/missing-file',
        ),
      });

      expect(ownership).toEqual({});
    });
  });
});
