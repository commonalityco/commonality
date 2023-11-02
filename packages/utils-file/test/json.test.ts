import os from 'node:os';
import { describe, expect, it, afterEach, beforeEach } from 'vitest';
import type { Workspace } from '@commonalityco/types';
import { createJson } from '../src/json.js';
import fs from 'fs-extra';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

describe('createJson', () => {
  const temporaryDirectoryPath = process.env['RUNNER_TEMP'] || os.tmpdir();
  const temporaryPath = fs.mkdtempSync(temporaryDirectoryPath);
  const workspace: Workspace = {
    path: '/packages/pkg-one',
    tags: [],
    codeowners: [],
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
    './fixtures/kitchen-sink',
  );

  beforeEach(async () => {
    await fs.copy(fixturePath, temporaryPath);
  });

  afterEach(async () => {
    await fs.remove(temporaryPath);
  });

  describe('get', () => {
    it('should read JSON file', async () => {
      const jsonFile = createJson({
        rootDirectory: temporaryPath,
        workspace,
      })('package.json');

      const json = await jsonFile.get('name');

      expect(json).toEqual('pkg-one');
    });

    it('returns undefined when the file does not exist', async () => {
      const jsonFile = createJson({
        rootDirectory: temporaryPath,
        workspace,
      })('nonexistent.json');

      await expect(jsonFile.get('name')).resolves.toEqual(undefined);
    });
  });

  describe('set', () => {
    it('should set value in JSON file', async () => {
      const jsonFile = createJson({
        rootDirectory: temporaryPath,
        workspace,
      })('package.json');

      await jsonFile.set('scripts.build', 'npm run build');

      const json = await jsonFile.get('scripts.build');

      expect(json).toEqual('npm run build');
    });

    it('should create the file and set the value if the file does not exist', async () => {
      const jsonFile = createJson({
        rootDirectory: temporaryPath,
        workspace,
      })('nonexistent.json');

      jsonFile.set('scripts.build', 'npm run build');
    });
  });

  describe('remove', () => {
    it('should remove value from JSON file', async () => {
      const jsonFile = createJson({
        rootDirectory: temporaryPath,
        workspace,
      })('package.json');

      await jsonFile.remove('workspaces');

      const json = await jsonFile.get('workspaces');

      expect(json).toEqual(undefined);
    });

    it('should handle when file does not exist', async () => {
      const jsonFile = createJson({
        rootDirectory: temporaryPath,
        workspace,
      })('nonexistent.json');

      await expect(jsonFile.remove('workspaces')).resolves.toBe(undefined);
    });
  });
});
