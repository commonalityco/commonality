import os from 'node:os';
import { describe, expect, it, afterEach, beforeEach } from 'vitest';
import type { Workspace } from '@commonalityco/types';
import { createText } from '../src/text.js';
import fs from 'fs-extra';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

describe('createText', () => {
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

  describe('matches', () => {
    it('returns true if the file content matches the expected string content', async () => {
      const textFile = createText({
        rootDirectory: temporaryPath,
        workspace,
      })('README.md');

      const isEqual = await textFile.matches('# Hello world');
      expect(isEqual).toBe(true);
    });

    it('returns true if the file content matches the expected array of string content', async () => {
      const textFile = createText({
        rootDirectory: temporaryPath,
        workspace,
      })('README.md');

      const isEqual = await textFile.matches(['# Hello world']);
      expect(isEqual).toBe(true);
    });

    it('returns false if the file content does not match the expected string content', async () => {
      const textFile = createText({
        rootDirectory: temporaryPath,
        workspace,
      })('README.md');

      const isEqual = await textFile.matches('# Goodbye');
      expect(isEqual).toBe(false);
    });

    it('returns false if the file content does not match the expected array of string content', async () => {
      const textFile = createText({
        rootDirectory: temporaryPath,
        workspace,
      })('README.md');

      const isEqual = await textFile.matches(['# Goodbye']);
      expect(isEqual).toBe(false);
    });
  });

  describe('get', () => {
    it('returns the text of the file', async () => {
      const textFile = createText({
        rootDirectory: temporaryPath,
        workspace,
      })('README.md');

      const text = await textFile.get();

      expect(text).toEqual(['# Hello world']);
    });

    it('returns undefined if the file does not exist', async () => {
      const textFile = createText({
        rootDirectory: temporaryPath,
        workspace,
      })('NON_EXISTENT.md');

      const text = await textFile.get();
      expect(text).toEqual(undefined);
    });
  });

  describe('set', () => {
    it('sets the text of the file', async () => {
      const textFile = createText({
        rootDirectory: temporaryPath,
        workspace,
      })('README.md');

      await textFile.set(['# New title']);

      const text = await textFile.get();

      expect(text).toContain('# New title');
    });

    it('creates a new file if it does not exist', async () => {
      const textFile = createText({
        rootDirectory: temporaryPath,
        workspace,
      })('NON_EXISTENT.md');

      await textFile.set(['# New title']);
      const text = await textFile.get();
      expect(text).toContain('# New title');
    });
  });

  describe('add', () => {
    it('adds a line to the file', async () => {
      const textFile = createText({
        rootDirectory: temporaryPath,
        workspace,
      })('README.md');

      await textFile.add('New line');

      const text = await textFile.get();

      expect(text).toContain('New line');
    });

    it('creates a new file if it does not exist', async () => {
      const textFile = createText({
        rootDirectory: temporaryPath,
        workspace,
      })('NON_EXISTENT.md');

      await textFile.add('New line');
      const text = await textFile.get();
      expect(text).toContain('New line');
    });
  });

  describe('remove', () => {
    it('removes a line from the file', async () => {
      const textFile = createText({
        rootDirectory: temporaryPath,
        workspace,
      })('README.md');

      await textFile.remove(['"description": "This is a test package"']);

      const text = await textFile.get();

      expect(text).not.toContain('"description": "This is a test package"');
    });

    it('does nothing if the file does not exist', async () => {
      const textFile = createText({
        rootDirectory: temporaryPath,
        workspace,
      })('NON_EXISTENT.md');

      await textFile.remove(['"description": "This is a test package"']);
      const text = await textFile.get();
      expect(text).toBe(undefined);
    });
  });
});
