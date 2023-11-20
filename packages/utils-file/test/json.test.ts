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
    it('should return the entire JSON file if not passed a path', async () => {
      const filepath = path.join(temporaryPath, workspace.path, 'package.json');
      const jsonFile = createJsonFileReader(filepath);
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

    it('should return a value when passed a valid path', async () => {
      const filepath = path.join(temporaryPath, workspace.path, 'package.json');
      const jsonFile = createJsonFileReader(filepath);
      const json = await jsonFile.get('scripts.dev');

      expect(json).toEqual('dev');
    });

    it('should return undefined when passed an invalid path', async () => {
      const filepath = path.join(temporaryPath, workspace.path, 'package.json');
      const jsonFile = createJsonFileReader(filepath);
      const json = await jsonFile.get('foo.bar');

      expect(json).toEqual(undefined);
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

    it('should return false if the file contains a partial match', async () => {
      const filepath = path.join(temporaryPath, workspace.path, 'package.json');
      const jsonFile = createJsonFileReader(filepath);

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

  describe('update', () => {
    it('should update the JSON file if the property exists', async () => {
      const filepath = path.join(temporaryPath, workspace.path, 'package.json');
      const jsonFile = createJsonFileWriter(filepath);

      await jsonFile.update({ scripts: { dev: 'npm run dev' } });

      const json = await fs.readJson(filepath);

      expect(json).toEqual({
        name: 'pkg-one',
        workspaces: [],
        description: 'This is a test package',
        version: '1.0.0',
        dependencies: {},
        devDependencies: {},
        peerDependencies: {},
        scripts: {
          dev: 'npm run dev',
          test: 'test',
        },
      });
    });

    it('should not update the JSON file if the property does not exist', async () => {
      const filepath = path.join(temporaryPath, workspace.path, 'package.json');
      const jsonFile = createJsonFileWriter(filepath);

      await jsonFile.update({ scripts: { foo: 'npm run dev' } });

      const json = await fs.readJson(filepath);

      expect(json).toEqual({
        name: 'pkg-one',
        workspaces: [],
        description: 'This is a test package',
        version: '1.0.0',
        dependencies: {},
        devDependencies: {},
        peerDependencies: {},
        scripts: {
          dev: 'dev',
          test: 'test',
        },
      });
    });

    it('should not create the file if it does not exist', async () => {
      const filepath = path.join(
        temporaryPath,
        workspace.path,
        'non-existent.json',
      );
      const jsonFile = createJsonFileWriter(filepath);

      await jsonFile.update({ scripts: { build: 'npm run build' } });

      const json = await fs.pathExists(filepath);

      expect(json).toEqual(false);
    });

    it('should leave the file unchanged if update is called with no arguments', async () => {
      const filepath = path.join(temporaryPath, workspace.path, 'package.json');
      const jsonFile = createJsonFileWriter(filepath);
      const originalJson = await fs.readJson(filepath);

      await jsonFile.update();

      const json = await fs.readJson(filepath);

      expect(json).toEqual(originalJson);
    });
  });

  describe('set', () => {
    it('should overwrite the JSON file', async () => {
      const filepath = path.join(temporaryPath, workspace.path, 'package.json');
      const jsonFile = createJsonFileWriter(filepath);

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
      const jsonFile = createJsonFileWriter(filepath);

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
      const jsonFile = createJsonFileWriter(filepath);
      const originalJson = await fs.readJson(filepath);

      await jsonFile.set();

      const json = await fs.readJson(filepath);

      expect(json).toEqual(originalJson);
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

    it('should return the original source object if nothing is passed', async () => {
      const filepath = path.join(temporaryPath, workspace.path, 'package.json');
      const jsonFile = createJsonFileWriter(filepath);

      const originalJson = await fs.readJSON(filepath);
      await jsonFile.merge();

      const updatedJson = await fs.readJSON(filepath);
      expect(updatedJson).toEqual(originalJson);
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

    it('should return the original json if remove is called with no arguments', async () => {
      const filepath = path.join(temporaryPath, workspace.path, 'package.json');
      const jsonFile = createJsonFileWriter(filepath);
      const originalJson = await fs.readJson(filepath);

      await jsonFile.remove();

      const json = await fs.readJson(filepath);

      expect(json).toEqual(originalJson);
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

  describe('diffPartial', () => {
    it('should output the correct snapshot when source and target are equal', async () => {
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

    it('should output the correct snapshot when source is a subset of the target', async () => {
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

    it('should output the correct snapshot when source is a superset of the target', async () => {
      const filepath = path.join(temporaryPath, workspace.path, 'package.json');
      const formatter = createJsonFileFormatter(filepath);

      const value = { scripts: { dev: 'dev' } };
      const result = await formatter.diff(value);

      expect(stripAnsi(result ?? '')).not.toMatchInlineSnapshot(`
        "{
          \\"scripts\\": {
            \\"dev\\": \\"dev\\"
          }
        }"
      `);
    });

    it('should output the correct snapshot when source does not match the target', async () => {
      const filepath = path.join(temporaryPath, workspace.path, 'package.json');
      const formatter = createJsonFileFormatter(filepath);

      const value = { publishConfig: { access: 'public' } };
      const result = await formatter.diff(value);

      expect(stripAnsi(result ?? '')).not.toMatchInlineSnapshot(
        '"No match found"',
      );
    });
  });

  describe('diffAdded', () => {
    it('should output the correct snapshot when source and target match', async () => {
      const filepath = path.join(temporaryPath, workspace.path, 'package.json');
      const formatter = createJsonFileFormatter(filepath);

      const json = await fs.readJson(filepath);
      const result = await formatter.diffAdded(json);

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

    it('should output the correct snapshot when source is a subset of the target', async () => {
      const filepath = path.join(temporaryPath, workspace.path, 'package.json');
      const formatter = createJsonFileFormatter(filepath);

      const json = await fs.readJson(filepath);
      const value = { ...json, extra: 'extra' };
      const result = await formatter.diffAdded(value);

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

    it('should output the correct snapshot when target is a subset of the source', async () => {
      const filepath = path.join(temporaryPath, workspace.path, 'package.json');
      const formatter = createJsonFileFormatter(filepath);

      const value = { name: 'foo', version: '1.0.0' };
      const result = await formatter.diffAdded(value);

      expect(stripAnsi(result ?? '')).toMatchInlineSnapshot(`
        "  Object {
            \\"dependencies\\": Object {},
            \\"description\\": \\"This is a test package\\",
            \\"devDependencies\\": Object {},
            \\"name\\": \\"pkg-one\\",
            \\"peerDependencies\\": Object {},
            \\"scripts\\": Object {
              \\"dev\\": \\"dev\\",
              \\"test\\": \\"test\\",
            },
        +   \\"name\\": \\"foo\\",
            \\"version\\": \\"1.0.0\\",
            \\"workspaces\\": Array [],
          }"
      `);
    });

    it('should output the correct snapshot when source does not match the target', async () => {
      const filepath = path.join(temporaryPath, workspace.path, 'package.json');
      const formatter = createJsonFileFormatter(filepath);

      const result = await formatter.diffAdded({
        publishConfig: { access: 'public' },
      });

      expect(stripAnsi(result ?? '')).toMatchInlineSnapshot(`
        "  Object {
            \\"dependencies\\": Object {},
            \\"description\\": \\"This is a test package\\",
            \\"devDependencies\\": Object {},
            \\"name\\": \\"pkg-one\\",
            \\"peerDependencies\\": Object {},
            \\"scripts\\": Object {
              \\"dev\\": \\"dev\\",
              \\"test\\": \\"test\\",
        +   \\"publishConfig\\": Object {
        +     \\"access\\": \\"public\\",
            },
            \\"version\\": \\"1.0.0\\",
            \\"workspaces\\": Array [],
          }"
      `);
    });
  });

  describe('diffRemoved', () => {
    it('should output the correct snapshot when source and target are equal', async () => {
      const filepath = path.join(temporaryPath, workspace.path, 'package.json');
      const formatter = createJsonFileFormatter(filepath);

      const json = await fs.readJson(filepath);
      const result = await formatter.diffRemoved(json);

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

    it('should output the correct snapshot when source does not match the target', async () => {
      const filepath = path.join(temporaryPath, workspace.path, 'package.json');
      const formatter = createJsonFileFormatter(filepath);

      const result = await formatter.diffRemoved({
        publishConfig: { access: 'public' },
      });

      expect(stripAnsi(result ?? '')).toMatchInlineSnapshot(`
        "  Object {
            \\"dependencies\\": Object {},
            \\"description\\": \\"This is a test package\\",
            \\"devDependencies\\": Object {},
            \\"name\\": \\"pkg-one\\",
            \\"peerDependencies\\": Object {},
            \\"scripts\\": Object {
              \\"dev\\": \\"dev\\",
              \\"test\\": \\"test\\",
        -   \\"publishConfig\\": Object {
        -     \\"access\\": \\"public\\",
            },
            \\"version\\": \\"1.0.0\\",
            \\"workspaces\\": Array [],
          }"
      `);
    });
  });
});
