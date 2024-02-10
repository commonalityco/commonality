import nodePath from 'node:path';
import { getCodeowners } from './get-codeowners.js';
import { getOwnersForPath } from './get-owners-for-path.js';
import { describe, test, expect } from 'vitest';
import { fileURLToPath } from 'node:url';

describe('get-owners-for-path', () => {
  test.each([
    {
      path: 'foo.js',
      owners: ['@js-owner'],
    },
    {
      path: 'build/logs/package.json',
      owners: ['@doctocat'],
    },
    {
      path: 'foo/apps/package.json',
      owners: ['@octocat'],
    },
    {
      path: 'docs/package.json',
      owners: ['@doctocat'],
    },
    {
      path: '/uncovered/folder/foewofiwjefwo.hello',
      owners: ['@global-owner1', '@global-owner2'],
    },
    {
      path: 'apps/github/package.json',
      owners: [],
    },
    {
      path: 'build/logs',
      owners: ['@doctocat'],
    },
  ])('$path', async ({ path, owners }) => {
    const codeowners = await getCodeowners({
      rootDirectory: nodePath.resolve(
        nodePath.dirname(fileURLToPath(import.meta.url)),
        '../../test/fixtures/github-example',
      ),
    });

    const ownersForPath = getOwnersForPath({ codeowners, path });

    expect(ownersForPath).toEqual(owners);
  });
});
