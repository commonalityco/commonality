import { DependencyType } from '@commonalityco/utils-core';
import path from 'path';
import { getPackages } from './get-packages';

describe('getPackages', () => {
  it('should return an array of packages excluding the root package', async () => {
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
        devDependencies: [],
        peerDependencies: [],
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
