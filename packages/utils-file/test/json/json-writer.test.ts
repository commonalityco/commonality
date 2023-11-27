import os from 'node:os';
import { describe, expect, it, afterEach, beforeEach } from 'vitest';
import type { Workspace } from '@commonalityco/types';
import fs from 'fs-extra';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { jsonWriter } from '../../src/json/json-writer.js';

describe('jsonWriter', () => {
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

  describe('set', () => {
    it('should overwrite the JSON file', async () => {
      const filepath = path.join(temporaryPath, workspace.path, 'package.json');
      const jsonFile = jsonWriter(filepath);

      await jsonFile.set({ scripts: { build: 'npm run build' } });

      const json = await fs.readJson(filepath);

      expect(json).toEqual({
        scripts: {
          build: 'npm run build',
        },
      });
    });

    it('should create the file and set the value if the file does not exist', async () => {
      const filepath = path.join(
        temporaryPath,
        workspace.path,
        'non-existent.json',
      );
      const jsonFile = jsonWriter(filepath);

      await jsonFile.set({ scripts: { build: 'npm run build' } });

      const json = await fs.readJson(filepath);

      expect(json).toEqual({
        scripts: {
          build: 'npm run build',
        },
      });
    });

    it('should leave the file unchanged if set is called with no arguments', async () => {
      const filepath = path.join(temporaryPath, workspace.path, 'package.json');
      const jsonFile = jsonWriter(filepath);
      const originalJson = await fs.readJson(filepath);

      // @ts-expect-error - Testing invalid arguments
      await jsonFile.set();

      const json = await fs.readJson(filepath);

      expect(json).toEqual(originalJson);
    });
  });

  describe('merge', () => {
    it('should merge values into an existing JSON file', async () => {
      const filepath = path.join(temporaryPath, workspace.path, 'package.json');
      const jsonFile = jsonWriter(filepath);

      await jsonFile.merge({ publishConfig: { access: 'public' } });

      const json = await fs.readJSON(filepath);

      expect(json).toEqual({
        dependencies: {},
        description: 'This is a test package',
        devDependencies: {},
        name: 'pkg-one',
        peerDependencies: {},
        publishConfig: {
          access: 'public',
        },
        scripts: {
          dev: 'dev',
          test: 'test',
        },
        version: '1.0.0',
        workspaces: [],
      });
    });

    it('should create the file and merge the values if the file does not exist', async () => {
      const filepath = path.join(
        temporaryPath,
        workspace.path,
        'non-existent.json',
      );
      const jsonFile = jsonWriter(filepath);

      await jsonFile.merge({ scripts: { test: 'npm run test' } });

      const json = await fs.readJson(filepath);

      expect(json).toEqual({
        scripts: {
          test: 'npm run test',
        },
      });
    });

    it('should return the original source object if nothing is passed', async () => {
      const filepath = path.join(temporaryPath, workspace.path, 'package.json');
      const jsonFile = jsonWriter(filepath);

      const originalJson = await fs.readJSON(filepath);

      // @ts-expect-error - Testing invalid arguments
      await jsonFile.merge();

      const updatedJson = await fs.readJSON(filepath);
      expect(updatedJson).toEqual(originalJson);
    });
  });

  describe('remove', () => {
    it('should remove value from JSON file', async () => {
      const filepath = path.join(temporaryPath, workspace.path, 'package.json');
      const jsonFile = jsonWriter(filepath);

      await jsonFile.remove('workspaces');

      const json = await fs.readJson(filepath);

      expect(json).toEqual({
        dependencies: {},
        description: 'This is a test package',
        devDependencies: {},
        name: 'pkg-one',
        peerDependencies: {},
        version: '1.0.0',
        scripts: {
          dev: 'dev',
          test: 'test',
        },
      });
    });

    it('should remove value from JSON file when passed a path', async () => {
      const filepath = path.join(temporaryPath, workspace.path, 'package.json');
      const jsonFile = jsonWriter(filepath);

      await jsonFile.remove('scripts.dev');

      const json = await fs.readJson(filepath);

      expect(json).toEqual({
        workspaces: [],
        dependencies: {},
        description: 'This is a test package',
        devDependencies: {},
        name: 'pkg-one',
        peerDependencies: {},
        scripts: {
          test: 'test',
        },
        version: '1.0.0',
      });
    });

    it('should return the original json if remove is called with no arguments', async () => {
      const filepath = path.join(temporaryPath, workspace.path, 'package.json');
      const jsonFile = jsonWriter(filepath);
      const originalJson = await fs.readJson(filepath);

      // @ts-expect-error - Testing invalid arguments
      await jsonFile.remove();

      const json = await fs.readJson(filepath);

      expect(json).toEqual(originalJson);
    });
  });
});
