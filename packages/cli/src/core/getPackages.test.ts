import { getPackages } from './getPackages';
import mock from 'mock-fs';
import { PackageType } from '@commonalityco/types';
import { describe, expect, beforeEach } from '@jest/globals';

describe('getPackages', () => {
  describe('when all projects have a commonality.json file', () => {
    beforeEach(() => {
      console.log('');
      mock({
        'root/packages/foo/package.json': JSON.stringify({
          version: '1.0.0',
          name: '@scope/foo',
          dependencies: {
            foo: '^1.0.0',
            next: '^13.0.0',
          },
          devDependencies: {
            bar: '^1.0.0',
          },
          peerDependencies: {
            baz: '^1.0.0',
          },
        }),
        'root/packages/foo/commonality.json': JSON.stringify({
          tags: ['tag-one'],
        }),
      });
    });

    afterEach(mock.restore);

    it('returns all packages within the monorepo', async () => {
      const packages = await getPackages({
        rootDirectory: 'root',
        packageDirectories: ['packages/foo'],
      });

      expect(packages).toEqual([
        {
          version: '1.0.0',
          owners: [],
          name: '@scope/foo',
          path: 'packages/foo',
          tags: ['tag-one'],
          type: PackageType.NEXT,
          dependencies: [
            {
              name: 'foo',
              version: '^1.0.0',
            },
            {
              name: 'next',
              version: '^13.0.0',
            },
          ],
          devDependencies: [
            {
              name: 'bar',
              version: '^1.0.0',
            },
          ],
          peerDependencies: [
            {
              name: 'baz',
              version: '^1.0.0',
            },
          ],
        },
      ]);
    });
  });

  describe('when all projects do not have a commonality.json file', () => {
    beforeEach(() => {
      console.log('');
      mock({
        'root/packages/foo/package.json': JSON.stringify({
          version: '1.0.0',
          name: '@scope/foo',
          dependencies: {
            foo: '^1.0.0',
          },
          devDependencies: {
            bar: '^1.0.0',
          },
          peerDependencies: {
            baz: '^1.0.0',
          },
        }),
      });
    });

    afterEach(mock.restore);

    it('returns all packages within the monorepo', async () => {
      const packages = await getPackages({
        rootDirectory: 'root',
        packageDirectories: ['packages/foo'],
      });

      expect(packages).toEqual([
        {
          version: '1.0.0',
          name: '@scope/foo',
          owners: [],
          path: 'packages/foo',
          tags: [],
          type: PackageType.NODE,
          dependencies: [
            {
              name: 'foo',
              version: '^1.0.0',
            },
          ],
          devDependencies: [
            {
              name: 'bar',
              version: '^1.0.0',
            },
          ],
          peerDependencies: [
            {
              name: 'baz',
              version: '^1.0.0',
            },
          ],
        },
      ]);
    });
  });
});
