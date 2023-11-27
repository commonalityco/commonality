import os from 'node:os';
import { describe, expect, it, afterEach, beforeEach } from 'vitest';
import type { Workspace } from '@commonalityco/types';
import fs from 'fs-extra';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { jsonReader } from '../../src/json/json-reader.js';

describe('jsonReader', () => {
  const temporaryDirectoryPath = process.env['RUNNER_TEMP'] || os.tmpdir();
  const temporaryPath = fs.mkdtempSync(temporaryDirectoryPath);
  const workspace: Workspace = {
    path: '/packages/pkg-one',
    relativePath: 'packages/pkg-one',
    packageJson: {
      workspaces: [],
      name: 'pkg-one',
      description: 'This is a test package',
      version: '1.0.0',
      dependencies: {},
      devDependencies: {},
      peerDependencies: {},
    },
  };

  const fixturePath = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    '../fixtures/kitchen-sink',
  );

  beforeEach(async () => {
    await fs.copy(fixturePath, temporaryPath);
  });

  afterEach(async () => {
    await fs.remove(temporaryPath);
  });

  describe('get', () => {
    it('should return the entire JSON file if not passed a path', async () => {
      const filepath = path.join(temporaryPath, workspace.path, 'package.json');
      const jsonFile = jsonReader(filepath);
      const json = await jsonFile.get();

      expect(json).toEqual({
        dependencies: {},
        description: 'This is a test package',
        devDependencies: {},
        name: 'pkg-one',
        peerDependencies: {},
        scripts: {
          dev: 'dev',
          test: 'test',
        },
        version: '1.0.0',
        workspaces: [],
      });
    });

    it('returns undefined when the file does not exist', async () => {
      const filepath = path.join(
        temporaryPath,
        workspace.path,
        'non-existent.json',
      );
      const jsonFile = jsonReader(filepath);

      await expect(jsonFile.get()).resolves.toEqual(undefined);
    });
  });

  describe('contains', () => {
    it('should return true if the file contains the value', async () => {
      const filepath = path.join(temporaryPath, workspace.path, 'package.json');
      const jsonFile = jsonReader(filepath);

      await expect(
        jsonFile.contains({
          scripts: {
            dev: 'dev',
          },
        }),
      ).resolves.toEqual(true);
    });

    it('should return false if the file does not contain the value', async () => {
      const filepath = path.join(temporaryPath, workspace.path, 'package.json');
      const jsonFile = jsonReader(filepath);

      await expect(
        jsonFile.contains({
          scripts: {
            dev: 'foo',
          },
        }),
      ).resolves.toEqual(false);
    });

    it('should return false if the file contains a partial match', async () => {
      const filepath = path.join(temporaryPath, workspace.path, 'package.json');
      const jsonFile = jsonReader(filepath);

      await expect(
        jsonFile.contains({
          scripts: {
            dev: 'dev',
            baz: 'baz',
          },
        }),
      ).resolves.toEqual(false);
    });
  });
});
