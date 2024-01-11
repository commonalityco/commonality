import { copy, remove, mkdtempSync, pathExists } from 'fs-extra';
import { afterAll, beforeEach, describe, expect, test } from 'vitest';
import os from 'node:os';
import path from 'node:path';
import { setTags } from '../src/set-tags';
import { fileURLToPath } from 'node:url';
import { PackageType } from '@commonalityco/utils-core';

describe('setTags', () => {
  describe('when setting tags for a package with no configuration file', () => {
    const temporaryDirectoryPath = process.env['RUNNER_TEMP'] || os.tmpdir();
    const temporaryPath = mkdtempSync(temporaryDirectoryPath);
    const emptyFixturePath = path.resolve(
      path.dirname(fileURLToPath(import.meta.url)),
      './fixtures/empty-project',
    );

    beforeEach(async () => {
      await copy(emptyFixturePath, temporaryPath);
    });

    afterAll(async () => {
      await remove(temporaryPath);
    });

    test('creates the configuration file', async () => {
      await setTags({
        rootDirectory: temporaryPath,
        pkg: {
          name: 'pkg-one',
          path: './packages/pkg-one',
          type: PackageType.NEXT,
          version: '1.0.0',
        },
        tags: ['tag-one'],
      });

      const isFileCreated = await pathExists(
        path.join(temporaryPath, 'packages/pkg-one/commonality.json'),
      );

      expect(isFileCreated).toEqual(true);
    });

    test('returns the path to the updated config file', async () => {
      const newTags = await setTags({
        rootDirectory: temporaryPath,
        pkg: {
          name: 'pkg-one',
          path: './packages/pkg-one',
          type: PackageType.NEXT,
          version: '1.0.0',
        },
        tags: ['tag-one'],
      });

      expect(newTags).toEqual(
        `${temporaryPath}/packages/pkg-one/commonality.json`,
      );
    });
  });

  describe('when setting tags for a package with existing tags', () => {
    const temporaryDirectoryPath = process.env['RUNNER_TEMP'] || os.tmpdir();
    const temporaryPath = mkdtempSync(temporaryDirectoryPath);
    const fixturePath = path.resolve(
      path.dirname(fileURLToPath(import.meta.url)),
      './fixtures/kitchen-sink',
    );

    beforeEach(async () => {
      await copy(fixturePath, temporaryPath);
    });

    afterAll(async () => {
      await remove(temporaryPath);
    });

    test('sets the new tags within the configuration file', async () => {
      await setTags({
        rootDirectory: temporaryPath,
        pkg: {
          name: 'pkg-one',
          path: './packages/pkg-one',
          type: PackageType.NEXT,
          version: '1.0.0',
        },
        tags: ['tag-one', 'new-tag'],
      });

      const isFileCreated = await pathExists(
        path.join(temporaryPath, 'packages/pkg-one/commonality.json'),
      );

      expect(isFileCreated).toEqual(true);
    });

    test('returns the correct tags', async () => {});
  });
});
