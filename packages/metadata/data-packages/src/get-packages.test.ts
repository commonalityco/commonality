import { DependencyType } from '@commonalityco/utils-core';
import path from 'path';
import { getPackages, getPackage } from './get-packages';
import { describe, expect, it } from 'vitest';

describe('getPackages', () => {
  it('should return an array of packages with internal dependencies excluding the root package', async () => {
    const rootDirectory = path.join(
      __dirname,
      '../test/fixtures',
      'kitchen-sink'
    );

    const packages = await getPackages({ rootDirectory });

    expect(packages).toEqual([
      {
        name: 'pkg-one',
        version: '1.0.0',
        description: 'pkg-one description',
        path: 'packages/pkg-one',
        dependencies: [
          {
            name: 'pkg-two',
            type: DependencyType.PRODUCTION,
            version: '1.0.0',
          },
        ],
      },
      {
        name: 'pkg-two',
        version: '1.0.0',
        description: 'pkg-two description',
        path: 'packages/pkg-two',
        dependencies: [],
      },
    ]);
  });

  it('should return an empty array if no packages are found', async () => {
    const rootDirectory = path.join(
      __dirname,
      '../test/fixtures',
      'no-packages'
    );

    const packages = await getPackages({ rootDirectory });

    expect(packages).toEqual([]);
  });

  it('should throw an error if a lockfile does not exist', async () => {
    const rootDirectory = path.join(
      __dirname,
      '../test/fixtures',
      'missing-lockfile'
    );

    await expect(getPackages({ rootDirectory })).rejects.toThrow();
  });
});

describe('getPackage', () => {
  it('should throw an error if package.json does not exist', async () => {
    const rootDirectory = path.join(
      __dirname,
      '../test/fixtures',
      'missing-json'
    );

    await expect(
      getPackage({ rootDirectory, directory: 'packages/pkg-one' })
    ).rejects.toThrow('No package.json file for directory');
  });

  it('should throw an error if package.json does not contain a name property', async () => {
    const rootDirectory = path.join(
      __dirname,
      '../test/fixtures',
      'missing-name'
    );

    await expect(
      getPackage({ rootDirectory, directory: 'packages/pkg-one' })
    ).rejects.toThrow();
  });

  it('should return a package object with correct properties that includes all dependencies', async () => {
    const rootDirectory = path.join(
      __dirname,
      '../test/fixtures',
      'kitchen-sink'
    );

    const packageObject = await getPackage({
      rootDirectory: rootDirectory,
      directory: 'packages/pkg-one',
    });

    expect(packageObject).toEqual({
      name: 'pkg-one',
      description: 'pkg-one description',
      path: 'packages/pkg-one',
      version: '1.0.0',
      dependencies: [
        { name: 'pkg-two', version: '1.0.0', type: DependencyType.PRODUCTION },
        {
          name: 'external-dep',
          type: DependencyType.PRODUCTION,
          version: '1.0.0',
        },
      ],
    });
  });
});
