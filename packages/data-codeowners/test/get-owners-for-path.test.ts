import nodePath from 'node:path';
import { getCodeowners } from '../src/core/get-codeowners.js';
import { getOwnersForPath } from '../src/core/get-owners-for-path.js';
import { describe, test, expect } from 'vitest';
import { fileURLToPath } from 'node:url';

const globalOwners = ['@global-owner1', '@global-owner2'];

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
      owners: ['docs@example.com', '@doctocat'],
    },
    {
      path: '/uncovered/folder/foewofiwjefwo.hello',
      owners: ['@global-owner1', '@global-owner2'],
    },
  ])('$path', async ({ path, owners }) => {
    const codeowners = await getCodeowners({
      rootDirectory: nodePath.resolve(
        nodePath.dirname(fileURLToPath(import.meta.url)),
        './fixtures/github-example',
      ),
    });

    const ownersForPath = getOwnersForPath({ codeowners, path });

    expect(ownersForPath).toEqual(owners);
  });
});
