import { describe, expect, it } from 'vitest';
import { getPackage } from './get-package';
import path from 'node:path';
import { PackageType } from '@commonalityco/utils-core';
import { fileURLToPath } from 'node:url';

describe('getPackage', () => {
  it('should return undefined if package.json does not exist', async () => {
    const rootDirectory = path.join(
      path.dirname(fileURLToPath(import.meta.url)),
      '../test/fixtures',
      'missing-json',
    );

    const pkg = await getPackage({
      rootDirectory,
      directory: 'packages/pkg-one',
    });

    expect(pkg).toEqual(undefined);
  });

  it('should return undefined if package.json does not contain a name property', async () => {
    const rootDirectory = path.join(
      path.dirname(fileURLToPath(import.meta.url)),
      '../test/fixtures',
      'missing-name',
    );

    const pkg = await getPackage({
      rootDirectory,
      directory: 'packages/pkg-one',
    });

    expect(pkg).toEqual(undefined);
  });

  it('should return a package object with correct properties that includes all dependencies', async () => {
    const rootDirectory = path.join(
      path.dirname(fileURLToPath(import.meta.url)),
      '../test/fixtures',
      'kitchen-sink',
    );

    const pkg = await getPackage({
      rootDirectory: rootDirectory,
      directory: 'packages/pkg-one',
    });

    expect(pkg).toEqual({
      name: 'pkg-one',
      description: 'pkg-one description',
      path: 'packages/pkg-one',
      type: PackageType.NODE,
      version: '1.0.0',
    });
  });
});
