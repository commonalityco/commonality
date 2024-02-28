import { PackageManager } from '@commonalityco/utils-core';
import path from 'node:path';
import { getWorkspaceGlobs } from '../src/get-workspace-globs';
import { describe, expect, test } from 'vitest';
import { fileURLToPath } from 'node:url';

describe('getWorkspaceGlobs', () => {
  test('returns default globs when there is no package manager workspaces or explicit workspaces configured', async () => {
    const rootDirectory = path.join(
      path.dirname(fileURLToPath(import.meta.url)),
      './fixtures',
      'uninitialized',
    );

    const config = await getWorkspaceGlobs({
      rootDirectory,
      packageManager: PackageManager.NPM,
    });

    expect(config).toEqual(['./**']);
  });

  test('returns the workspaces when set via project configuration', async () => {
    const rootDirectory = path.join(
      path.dirname(fileURLToPath(import.meta.url)),
      './fixtures',
      'explicit-workspaces',
    );

    const workspaceGlobs = await getWorkspaceGlobs({
      rootDirectory,
      packageManager: PackageManager.PNPM,
    });

    expect(workspaceGlobs).toEqual(['apps/**', 'packages/**']);
  });

  test('returns the default globs when set to an empty array via project configuration', async () => {
    const rootDirectory = path.join(
      path.dirname(fileURLToPath(import.meta.url)),
      './fixtures',
      'empty-workspaces',
    );

    const workspaceGlobs = await getWorkspaceGlobs({
      rootDirectory,
      packageManager: PackageManager.PNPM,
    });

    expect(workspaceGlobs).toEqual(['./**']);
  });

  test('returns the workspaces when set with npm', async () => {
    const rootDirectory = path.join(
      path.dirname(fileURLToPath(import.meta.url)),
      './fixtures',
      'npm-workspace',
    );

    const workspaceGlobs = await getWorkspaceGlobs({
      rootDirectory,
      packageManager: PackageManager.NPM,
    });

    expect(workspaceGlobs).toEqual(['apps/**', 'packages/**']);
  });

  test('returns the workspaces when set with yarn', async () => {
    const rootDirectory = path.join(
      path.dirname(fileURLToPath(import.meta.url)),
      './fixtures',
      'yarn-workspace',
    );

    const workspaceGlobs = await getWorkspaceGlobs({
      rootDirectory,
      packageManager: PackageManager.YARN,
    });

    expect(workspaceGlobs).toEqual(['apps/**', 'packages/**']);
  });

  test('returns the workspaces when set with yarn berry', async () => {
    const rootDirectory = path.join(
      path.dirname(fileURLToPath(import.meta.url)),
      './fixtures',
      'yarn-berry-workspace',
    );

    const workspaceGlobs = await getWorkspaceGlobs({
      rootDirectory,
      packageManager: PackageManager.YARN,
    });

    expect(workspaceGlobs).toEqual(['apps/**', 'packages/**']);
  });

  test('returns the workspaces when set with pnpm', async () => {
    const rootDirectory = path.join(
      path.dirname(fileURLToPath(import.meta.url)),
      './fixtures',
      'pnpm-workspace',
    );

    const workspaceGlobs = await getWorkspaceGlobs({
      rootDirectory,
      packageManager: PackageManager.PNPM,
    });

    expect(workspaceGlobs).toEqual(['apps/**', 'packages/**']);
  });
});
