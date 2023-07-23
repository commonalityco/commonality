import { copy, mkdtemp, remove, mkdtempSync, pathExists } from 'fs-extra';
import { afterAll, beforeEach, describe, expect, test } from 'vitest';
import os from 'os';
import path, { sep } from 'path';
import { setTags } from './set-tags';

describe('setTags', () => {
  describe('when setting tags for a package with no configuration file', () => {
    const tmpDirPath = os.tmpdir();
    const tempPath = mkdtempSync(tmpDirPath);
    const emptyFixturePath = path.resolve(
      __dirname,
      '../test/fixtures/empty-project'
    );

    beforeEach(async () => {
      await copy(emptyFixturePath, tempPath);
    });

    afterAll(async () => {
      await remove(tempPath);
    });

    test('creates the configuration file', async () => {
      await setTags({
        rootDirectory: tempPath,
        packageName: 'pkg-one',
        tags: ['tag-one'],
      });

      const isFileCreated = await pathExists(
        path.join(tempPath, 'packages/pkg-one/commonality.json')
      );

      expect(isFileCreated).toEqual(true);
    });

    test('returns the correct tags', async () => {
      const newTags = await setTags({
        rootDirectory: tempPath,
        packageName: 'pkg-one',
        tags: ['tag-one'],
      });

      expect(newTags).toEqual(['tag-one']);
    });
  });

  describe('when setting tags for a package with existing tags', () => {
    const tmpDirPath = os.tmpdir();
    const tempPath = mkdtempSync(tmpDirPath);
    const fixturePath = path.resolve(
      __dirname,
      '../test/fixtures/kitchen-sink'
    );

    beforeEach(async () => {
      await copy(fixturePath, tempPath);
    });

    afterAll(async () => {
      await remove(tempPath);
    });

    test('sets the new tags within the configuration file', async () => {
      await setTags({
        rootDirectory: tempPath,
        packageName: 'pkg-one',
        tags: ['tag-one', 'new-tag'],
      });

      const isFileCreated = await pathExists(
        path.join(tempPath, 'packages/pkg-one/commonality.json')
      );

      expect(isFileCreated).toEqual(true);
    });

    test('returns the correct tags', async () => {});
  });
});
