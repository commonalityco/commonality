import nodePath from 'node:path';
import { getCodeowners } from './get-codeowners';
import { getOwnersForPath } from './get-owners-for-path';
import { describe, test, expect } from 'vitest';

const globalOwners = ['@global-owner1', '@global-owner2'];

describe('get-owners-for-path', () => {
  test.each([
    {
      path: 'foo.js',
      owners: ['@js-owner', ...globalOwners],
    },
    {
      path: 'build/logs/package.json',
      owners: ['@doctocat', ...globalOwners],
    },
    {
      path: 'foo/apps/package.json',
      owners: ['@octocat', ...globalOwners],
    },
    {
      path: 'docs/package.json',
      owners: ['docs@example.com', ...globalOwners, '@doctocat'],
    },
  ])('$path', async ({ path, owners }) => {
    const codeowners = await getCodeowners({
      rootDirectory: nodePath.resolve(
        __dirname,
        '../../test/fixtures/github-example'
      ),
    });

    const ownersForPath = getOwnersForPath({ codeowners, path });

    expect(ownersForPath).toEqual(owners);
  });
});
