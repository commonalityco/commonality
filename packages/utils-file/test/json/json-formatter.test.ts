import stripAnsi from 'strip-ansi';
import os from 'node:os';
import { describe, expect, it, afterEach, beforeEach } from 'vitest';
import type { Workspace } from '@commonalityco/types';
import fs from 'fs-extra';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { jsonFormatter } from '../../src/json/json-formatter';

describe('jsonFormatter', () => {
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
    '../fixtures/kitchen-sink',
  );

  beforeEach(async () => {
    await fs.copy(fixturePath, temporaryPath);
  });

  afterEach(async () => {
    await fs.remove(temporaryPath);
  });

  describe('diff', () => {
    it('should output the correct snapshot when source and target are equal', async () => {
      const filepath = path.join(temporaryPath, workspace.path, 'package.json');
      const formatter = jsonFormatter(filepath);

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
      const formatter = jsonFormatter(filepath);

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
      const formatter = jsonFormatter(filepath);

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
      const formatter = jsonFormatter(filepath);

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
      const formatter = jsonFormatter(filepath);

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
      const formatter = jsonFormatter(filepath);

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
      const formatter = jsonFormatter(filepath);

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
      const formatter = jsonFormatter(filepath);

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
      const formatter = jsonFormatter(filepath);

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
      const formatter = jsonFormatter(filepath);

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
