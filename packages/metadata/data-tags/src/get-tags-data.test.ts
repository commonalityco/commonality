import { Package, TagsData } from '@commonalityco/types';
import path from 'path';
import { describe, beforeAll, afterAll, test, expect } from 'vitest';
import { getTagsData } from './get-tags-data';

describe('getTagsData', () => {
  describe('when in a project with tags', () => {
    const testDirectory = path.join(__dirname, '../test/fixtures/kitchen-sink');

    test('returns the correct data', async () => {
      const packages = [
        {
          name: 'pkg-one',
          path: 'packages/pkg-one',
          version: '0.0.0',
          dependencies: [],
          devDependencies: [],
          peerDependencies: [],
        },
        {
          name: 'pkg-two',
          path: 'packages/pkg-two',
          version: '0.0.0',
          dependencies: [],
          devDependencies: [],
          peerDependencies: [],
        },
        {
          name: 'pkg-three',
          path: 'packages/pkg-three',
          version: '0.0.0',
          dependencies: [],
          devDependencies: [],
          peerDependencies: [],
        },
      ] satisfies Package[];

      const tagsData = await getTagsData({
        rootDirectory: testDirectory,
        packages,
      });

      const expectTagsData = [
        { packageName: 'pkg-one', tags: ['tag-one'] },
        { packageName: 'pkg-two', tags: ['tag-two', 'crazy-tag-whoa'] },
      ] satisfies TagsData[];

      expect(tagsData).toEqual(expectTagsData);
    });
  });

  describe('when in a project with no tags', () => {
    test('returns an empty array', async () => {
      const testDirectory = path.join(
        __dirname,
        '../test/fixtures/empty-project'
      );

      const packages = [
        {
          name: 'pkg-one',
          path: 'packages/pkg-one',
          version: '0.0.0',
          dependencies: [],
          devDependencies: [],
          peerDependencies: [],
        },
        {
          name: 'pkg-two',
          path: 'packages/pkg-two',
          version: '0.0.0',
          dependencies: [],
          devDependencies: [],
          peerDependencies: [],
        },
        {
          name: 'pkg-three',
          path: 'packages/pkg-three',
          version: '0.0.0',
          dependencies: [],
          devDependencies: [],
          peerDependencies: [],
        },
      ] satisfies Package[];

      const tagsData = await getTagsData({
        rootDirectory: testDirectory,
        packages,
      });

      const expectTagsData = [] satisfies TagsData[];

      expect(tagsData).toEqual(expectTagsData);
    });
  });
});
