import path from 'node:path';
import { getRootPackageName } from '../src/get-root-package-name';
import { describe, expect, it } from 'vitest';
import { fileURLToPath } from 'node:url';

describe('getRootPackageName', () => {
  it('returns undefined when the ', async () => {
    const rootDirectory = path.join(
      path.dirname(fileURLToPath(import.meta.url)),
      './fixtures',
      'missing-json-root',
    );

    await expect(getRootPackageName({ rootDirectory })).rejects.toThrow();
  });

  it('should throw an error if package.json does not contain a name property', async () => {
    const rootDirectory = path.join(
      path.dirname(fileURLToPath(import.meta.url)),
      './fixtures',
      'missing-name-root',
    );

    await expect(getRootPackageName({ rootDirectory })).rejects.toThrow();
  });

  it('should return a package object with correct properties', async () => {
    const rootDirectory = path.join(
      path.dirname(fileURLToPath(import.meta.url)),
      './fixtures',
      'kitchen-sink',
    );

    const packageObject = await getRootPackageName({
      rootDirectory: rootDirectory,
    });

    expect(packageObject).toEqual('root');
  });
});
