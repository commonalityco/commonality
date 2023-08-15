import { PackageManager } from '@commonalityco/utils-core';
import path from 'node:path';
import { getWorkspaceGlobs } from '../src/get-workspace-globs';
import { describe, expect, it } from 'vitest';
import { fileURLToPath } from 'node:url';

describe('getWorkspaceGlobs', () => {
  describe('when run in an un-initialized project', () => {
    it('returns the default globs', async () => {
      const rootDirectory = path.join(
        path.dirname(fileURLToPath(import.meta.url)),
        './fixtures',
        'uninitialized',
      );

      const config = await getWorkspaceGlobs({
        rootDirectory,
        packageManager: PackageManager.PNPM,
      });

      expect(config).toEqual(['./**']);
    });
  });

  describe('when run in an initialized project', () => {
    describe('when the workspace option exists', () => {
      const expectedWorkspaceGlobs = ['./packages/**', './apps/**'];

      it(`should return the correct globs for an NPM workspace`, async () => {
        const rootDirectory = path.join(
          path.dirname(fileURLToPath(import.meta.url)),
          './fixtures',
          'npm-workspace',
        );
        const workspaceGlobs = await getWorkspaceGlobs({
          rootDirectory,
          packageManager: PackageManager.NPM,
        });

        expect(workspaceGlobs).toEqual(expectedWorkspaceGlobs);
      });

      it(`should return the correct globs for a Yarn workspace`, async () => {
        const rootDirectory = path.join(
          path.dirname(fileURLToPath(import.meta.url)),
          './fixtures',
          'yarn-workspace',
        );
        const workspaceGlobs = await getWorkspaceGlobs({
          rootDirectory,
          packageManager: PackageManager.YARN,
        });

        expect(workspaceGlobs).toEqual(expectedWorkspaceGlobs);
      });

      it(`should return the correct globs for a pnpm workspace`, async () => {
        const rootDirectory = path.join(
          path.dirname(fileURLToPath(import.meta.url)),
          './fixtures',
          'pnpm-workspace',
        );
        const workspaceGlobs = await getWorkspaceGlobs({
          rootDirectory,
          packageManager: PackageManager.PNPM,
        });

        expect(workspaceGlobs).toEqual(expectedWorkspaceGlobs);
      });
    });

    describe('when the workspace option does not exist', () => {
      it(`should return the default globs`, async () => {
        const rootDirectory = path.join(
          path.dirname(fileURLToPath(import.meta.url)),
          './fixtures',
          'missing-workspace-globs',
        );
        const workspaceGlobs = await getWorkspaceGlobs({
          rootDirectory,
          packageManager: PackageManager.PNPM,
        });

        expect(workspaceGlobs).toEqual(['./**']);
      });
    });
  });
});
