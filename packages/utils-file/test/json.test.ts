import stripAnsi from 'strip-ansi';
import os from 'node:os';
import { describe, expect, it, afterEach, beforeEach } from 'vitest';
import type { Workspace } from '@commonalityco/types';
import fs from 'fs-extra';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  createJsonFileFormatter,
  createJsonFileReader,
  createJsonFileWriter,
} from '../src';

describe('createJsonFileReader', () => {
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
      const filepath = path.join(temporaryPath, workspace.path, 'package.json');
      const jsonFile = createJsonFileReader(filepath);
      const json = await jsonFile.get('name');

      expect(json).toEqual('pkg-one');
    });

    it('returns undefined when the file does not exist', async () => {
      const filepath = path.join(
        temporaryPath,
        workspace.path,
        'non-existent.json',
      );
      const jsonFile = createJsonFileReader(filepath);

      await expect(jsonFile.get('name')).resolves.toEqual(undefined);
    });
  });

  describe('exists', () => {
    it('should return true if the file exists', async () => {
      const filepath = path.join(temporaryPath, workspace.path, 'package.json');
      const jsonFile = createJsonFileReader(filepath);

      await expect(jsonFile.exists()).resolves.toEqual(true);
    });

    it('should return false if the file does not exist', async () => {
      const filepath = path.join(
        temporaryPath,
        workspace.path,
        'non-existent.json',
      );
      const jsonFile = createJsonFileReader(filepath);

      await expect(jsonFile.exists()).resolves.toEqual(false);
    });
  });

  describe('contains', () => {
    it('should return true if the file contains the value', async () => {
      const filepath = path.join(temporaryPath, workspace.path, 'package.json');
      const jsonFile = createJsonFileReader(filepath);

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
      const jsonFile = createJsonFileReader(filepath);

      await expect(
        jsonFile.contains({
          scripts: {
            dev: 'foo',
          },
        }),
      ).resolves.toEqual(false);
    });
  });
});

describe('createJsonFileWriter', () => {
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

  describe('set', () => {
    it('should set value in JSON file', async () => {
      const filepath = path.join(temporaryPath, workspace.path, 'package.json');
      const jsonFile = createJsonFileWriter(filepath);

      await jsonFile.set('scripts.build', 'npm run build');

      const json = await fs.readJson(filepath);

      expect(json).toEqual({
        dependencies: {},
        description: 'This is a test package',
        devDependencies: {},
        name: 'pkg-one',
        peerDependencies: {},
        scripts: {
          build: 'npm run build',
          dev: 'dev',
          test: 'test',
        },
        version: '1.0.0',
        workspaces: [],
      });
    });

    it('should create the file and set the value if the file does not exist', async () => {
      const filepath = path.join(
        temporaryPath,
        workspace.path,
        'non-existent.json',
      );
      const jsonFile = createJsonFileWriter(filepath);

      jsonFile.set('scripts.build', 'npm run build');
    });
  });

  describe('merge', () => {
    it('should merge values into an existing JSON file', async () => {
      const filepath = path.join(temporaryPath, workspace.path, 'package.json');
      const jsonFile = createJsonFileWriter(filepath);

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
      const jsonFile = createJsonFileWriter(filepath);

      await jsonFile.merge({ scripts: { test: 'npm run test' } });

      const json = await fs.readJson(filepath);

      expect(json).toEqual({
        scripts: {
          test: 'npm run test',
        },
      });
    });
  });

  describe('remove', () => {
    it('should remove value from JSON file', async () => {
      const filepath = path.join(temporaryPath, workspace.path, 'package.json');
      const jsonFile = createJsonFileWriter(filepath);

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
      const jsonFile = createJsonFileWriter(filepath);

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
  });
});

describe('createJsonFileFormatter', () => {
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

  it('should return dimmed green string when subset and value match', async () => {
    const filepath = path.join(temporaryPath, workspace.path, 'package.json');
    const formatter = createJsonFileFormatter(filepath);

    const json = await fs.readJson(filepath);
    const result = await formatter.diff(json);

    expect(stripAnsi(result ?? '')).toMatchInlineSnapshot(`
      "{
        \\"name\\": \\"pkg-one\\",
        \\"workspaces\\": [],
        \\"description\\": \\"This is a test package\\",
        \\"version\\": \\"1.0.0\\",
        \\"dependencies\\": {},
        \\"devDependencies\\": {},
        \\"peerDependencies\\": {},
        \\"scripts\\": {
          \\"dev\\": \\"dev\\",
          \\"test\\": \\"test\\"
        }
      }"
    `);
  });

  it('should return diff string when json is a subset of the value', async () => {
    const filepath = path.join(temporaryPath, workspace.path, 'package.json');
    const formatter = createJsonFileFormatter(filepath);

    const json = await fs.readJson(filepath);
    const value = { ...json, extra: 'extra' };
    const result = await formatter.diff(value);

    expect(stripAnsi(result ?? '')).not.toMatchInlineSnapshot(`
      "  Object {
          \\"dependencies\\": Object {},
          \\"description\\": \\"This is a test package\\",
          \\"devDependencies\\": Object {},
      +   \\"extra\\": \\"extra\\",
          \\"name\\": \\"pkg-one\\",
          \\"peerDependencies\\": Object {},
          \\"scripts\\": Object {
            \\"dev\\": \\"dev\\",
            \\"test\\": \\"test\\",
          },
          \\"version\\": \\"1.0.0\\",
          \\"workspaces\\": Array [],
        }"
    `);
  });

  it('should return diff string when value is a subset of the json', async () => {
    const filepath = path.join(temporaryPath, workspace.path, 'package.json');
    const formatter = createJsonFileFormatter(filepath);

    const value = { name: 'foo' };
    const result = await formatter.diff(value);

    expect(stripAnsi(result ?? '')).toMatchInlineSnapshot(`
      "  Object {
          \\"name\\": \\"pkg-one\\",
      -   \\"name\\": \\"foo\\",
        }"
    `);
  });
});
