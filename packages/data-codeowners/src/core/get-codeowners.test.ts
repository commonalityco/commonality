/* eslint-disable @typescript-eslint/naming-convention */
import path from 'node:path';
import { getCodeowners } from './get-codeowners';
import { describe, it, expect } from 'vitest';

describe('getCodeOwners', () => {
  describe('when the file is at the root of the repo', () => {
    it('returns an object containing the correct owners for each glob', async () => {
      const rootDirectory = path.resolve(
        __dirname,
        '../../test/fixtures/github-example'
      );
      const ownership = await getCodeowners({ rootDirectory });

      const globalOwners = ['@global-owner1', '@global-owner2'];

      expect(ownership).toEqual({
        '*.js': ['@js-owner', ...globalOwners],
        '*.go': ['docs@example.com', ...globalOwners],
        '*.txt': ['@octo-org/octocats', ...globalOwners],
        '/build/logs/': ['@doctocat', ...globalOwners],
        'docs/*': ['docs@example.com', ...globalOwners],
        'apps/': ['@octocat', ...globalOwners],
        '/docs/': ['@doctocat', ...globalOwners],
        '/scripts/': ['@doctocat', '@octocat', ...globalOwners],
        '/apps/': ['@octocat', ...globalOwners],
        '/apps/github': globalOwners,
      });
    });
  });

  describe('when there is no CODEOWNERS file', () => {
    it('returns an empty object', async () => {
      const ownership = await getCodeowners({
        rootDirectory: path.resolve(__dirname, '../test/fixtures/missing-file'),
      });

      expect(ownership).toEqual({});
    });
  });
});
