import { describe, expect, it } from 'vitest';
import { getPackage } from '../src/get-package';
import path from 'node:path';
import { PackageType } from '@commonalityco/utils-core';
import { fileURLToPath } from 'node:url';

describe('getPackage', () => {
  it('should throw an error if package.json does not exist', async () => {
    const rootDirectory = path.join(
      path.dirname(fileURLToPath(import.meta.url)),
      './fixtures',
      'missing-json',
    );

    await expect(
      getPackage({ rootDirectory, directory: 'packages/pkg-one' }),
    ).rejects.toThrow('No package.json file for directory');
  });

  it('should throw an error if package.json does not contain a name property', async () => {
    const rootDirectory = path.join(
      path.dirname(fileURLToPath(import.meta.url)),
      './fixtures',
      'missing-name',
    );

    await expect(
      getPackage({ rootDirectory, directory: 'packages/pkg-one' }),
    ).rejects.toThrow();
  });

  it('should return a package object with correct properties that includes all dependencies', async () => {
    const rootDirectory = path.join(
      path.dirname(fileURLToPath(import.meta.url)),
      './fixtures',
      'kitchen-sink',
    );

    const packageObject = await getPackage({
      rootDirectory: rootDirectory,
      directory: 'packages/pkg-one',
    });

    expect(packageObject).toEqual({
      name: 'pkg-one',
      description: 'pkg-one description',
      path: 'packages/pkg-one',
      type: PackageType.NODE,
      version: '1.0.0',
    });
  });
});
