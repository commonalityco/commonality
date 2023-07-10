import { PackageManager } from '@commonalityco/utils-core';
import path from 'path';
import { getWorkspaceGlobs } from './get-workspace-globs';

describe('getWorkspaceGlobs', () => {
  describe('when the workspace option exists', () => {
    const expectedWorkspaceGlobs = ['./packages/**', './apps/**'];

    it(`should return the correct globs for an NPM workspace`, async () => {
      const rootDirectory = path.join(
        __dirname,
        '../fixtures',
        'npm-workspace'
      );
      const workspaceGlobs = await getWorkspaceGlobs({
        rootDirectory,
        packageManager: PackageManager.NPM,
      });

      expect(workspaceGlobs).toEqual(expectedWorkspaceGlobs);
    });

    it(`should return the correct globs for a Yarn workspace`, async () => {
      const rootDirectory = path.join(
        __dirname,
        '../fixtures',
        'yarn-workspace'
      );
      const workspaceGlobs = await getWorkspaceGlobs({
        rootDirectory,
        packageManager: PackageManager.YARN,
      });

      expect(workspaceGlobs).toEqual(expectedWorkspaceGlobs);
    });

    it(`should return the correct globs for a pnpm workspace`, async () => {
      const rootDirectory = path.join(
        __dirname,
        '../fixtures',
        'pnpm-workspace'
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
        __dirname,
        '../fixtures',
        'missing-workspace-globs'
      );
      const workspaceGlobs = await getWorkspaceGlobs({
        rootDirectory,
        packageManager: PackageManager.PNPM,
      });

      expect(workspaceGlobs).toEqual(['./**']);
    });
  });
});
