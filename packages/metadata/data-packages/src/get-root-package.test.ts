import path from 'path';
import { getRootPackage } from './get-root-package';

describe('getRootPackage', () => {
  it('should throw an error if package.json does not exist', async () => {
    const rootDirectory = path.join(
      __dirname,
      '../test/fixtures',
      'missing-json-root'
    );

    await expect(getRootPackage({ rootDirectory })).rejects.toThrow(
      'No package.json file for directory'
    );
  });

  it('should throw an error if package.json does not contain a name property', async () => {
    const rootDirectory = path.join(
      __dirname,
      '../test/fixtures',
      'missing-name-root'
    );

    await expect(getRootPackage({ rootDirectory })).rejects.toThrow();
  });

  it('should return a package object with correct properties', async () => {
    const rootDirectory = path.join(
      __dirname,
      '../test/fixtures',
      'kitchen-sink'
    );

    const packageObject = await getRootPackage({
      rootDirectory: rootDirectory,
    });

    expect(packageObject).toEqual({
      name: 'root',
      description: 'root description',
      path: './',
      version: '1.0.0',
      dependencies: [],
      devDependencies: [],
      peerDependencies: [],
    });
  });
});
