import os from 'node:os';
import { describe, expect, it, afterEach, beforeEach } from 'vitest';
import type { Workspace } from '@commonalityco/types';
import { File } from '../src/file.js';
import fs from 'fs-extra';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

describe('File class', () => {
  const temporaryDirectoryPath = process.env['RUNNER_TEMP'] || os.tmpdir();
  const temporaryPath = fs.mkdtempSync(temporaryDirectoryPath);
  const workspace: Workspace = {
    path: '/packages/pkg-one',
    tags: [],
    codeowners: [],
    packageJson: {
      workspaces: [],
      name: 'test-package',
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

  describe('delete', () => {
    it('remove the file from disk', async () => {
      const file = new File(workspace, temporaryPath, 'package.json');

      await file.delete();

      const exists = await fs.pathExists(
        path.join(temporaryPath, workspace.path, 'package.json'),
      );

      expect(exists).toBe(false);
    });

    it('does not throw error when file does not exist', async () => {
      const file = new File(workspace, temporaryPath, 'nonexistent.json');

      await expect(file.delete()).resolves.not.toThrow();
    });
  });

  describe('exists', () => {
    it('returns true when the file exists', async () => {
      const file = new File(workspace, temporaryPath, 'package.json');
      const exists = await file.exists();

      expect(exists).toBe(true);
    });

    it('returns false when the file does not exist', async () => {
      const file = new File(workspace, temporaryPath, 'foo.text');
      const exists = await file.exists();

      expect(exists).toBe(false);
    });
  });
});
