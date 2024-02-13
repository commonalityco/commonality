import path from 'node:path';
import { getPackages } from './get-packages';
import { describe, expect, it } from 'vitest';
import { PackageType } from '@commonalityco/utils-core';
import { fileURLToPath } from 'node:url';

describe('getPackages', () => {
  it('should return the root package if the project is not a monorepo', async () => {
    const rootDirectory = path.join(
      path.dirname(fileURLToPath(import.meta.url)),
      '../test/fixtures',
      'single-package-repo',
    );

    const packages = await getPackages({ rootDirectory });

    expect(packages).toEqual([
      {
        name: 'root',
        version: '1.0.0',
        description: 'root description',
        path: '.',
        type: PackageType.NODE,
      },
    ]);
  });

  it('should return an array of packages with internal dependencies excluding the root package', async () => {
    const rootDirectory = path.join(
      path.dirname(fileURLToPath(import.meta.url)),
      '../test/fixtures',
      'kitchen-sink',
    );

    const packages = await getPackages({ rootDirectory });

    expect(packages).toEqual([
      {
        name: 'pkg-one',
        version: '1.0.0',
        description: 'pkg-one description',
        path: 'packages/pkg-one',
        type: PackageType.NODE,
      },
      {
        name: 'pkg-two',
        version: '1.0.0',
        description: 'pkg-two description',
        path: 'packages/pkg-two',
        type: PackageType.NODE,
      },
    ]);
  });

  it('should throw an error if a lockfile does not exist', async () => {
    const rootDirectory = path.join(
      path.dirname(fileURLToPath(import.meta.url)),
      '../test/fixtures',
      'missing-lockfile',
    );

    await expect(getPackages({ rootDirectory })).rejects.toThrow();
  });
});
