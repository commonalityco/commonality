import { PackageManager } from '@commonalityco/utils-core';
import path from 'node:path';
import { getWorkspaceGlobs } from '../src/get-workspace-globs';
import { afterEach, describe, expect, test } from 'vitest';
import { fileURLToPath } from 'node:url';
import mockFs from 'mock-fs';

describe('getWorkspaceGlobs', () => {
  afterEach(() => {
    mockFs.restore();
  });

  test('returns default globs when there is no package manager workspaces or explicit workspaces configured', async () => {
    mockFs({
      'package.json': JSON.stringify({}),
      'package-lock.json': JSON.stringify({}),
    });

    const config = await getWorkspaceGlobs({
      rootDirectory: './',
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
    mockFs({
      'package.json': JSON.stringify({
        workspaces: ['apps/**', 'packages/**'],
      }),
      'package-lock.json': JSON.stringify({}),
    });

    const workspaceGlobs = await getWorkspaceGlobs({
      rootDirectory: './',
      packageManager: PackageManager.NPM,
    });

    expect(workspaceGlobs).toEqual(['apps/**', 'packages/**']);
  });

  test('returns the workspaces when set with yarn', async () => {
    mockFs({
      'package.json': JSON.stringify({
        workspaces: ['apps/**', 'packages/**'],
      }),
      'yarn.lock': '',
    });

    const workspaceGlobs = await getWorkspaceGlobs({
      rootDirectory: './',
      packageManager: PackageManager.YARN,
    });

    expect(workspaceGlobs).toEqual(['apps/**', 'packages/**']);
  });

  test('returns the workspaces when set with pnpm', async () => {
    mockFs({
      'pnpm-lock.yaml': '',
      'pnpm-workspace.yaml': `
        packages:
          - 'apps/**'
          - 'packages/**'
      `,
    });

    const workspaceGlobs = await getWorkspaceGlobs({
      rootDirectory: './',
      packageManager: PackageManager.PNPM,
    });

    expect(workspaceGlobs).toEqual(['apps/**', 'packages/**']);
  });
});
