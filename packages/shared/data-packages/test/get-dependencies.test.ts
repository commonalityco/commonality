import { getDependencies } from '../src/get-dependencies.js';
import { describe, expect, it } from 'vitest';
import path from 'node:path';
import { DependencyType } from '@commonalityco/utils-core';
import { Dependency } from '@commonalityco/types';
import { fileURLToPath } from 'node:url';

describe('getDependencies', () => {
  it('should throw an error if package.json does not contain a name property', async () => {
    const rootDirectory = path.join(
      path.dirname(fileURLToPath(import.meta.url)),
      './fixtures',
      'missing-name',
    );

    await expect(getDependencies({ rootDirectory })).rejects.toThrow();
  });

  it('should return a package object with correct properties that includes all dependencies', async () => {
    const rootDirectory = path.join(
      path.dirname(fileURLToPath(import.meta.url)),
      './fixtures',
      'kitchen-sink',
    );

    const dependencies = await getDependencies({
      rootDirectory: rootDirectory,
    });

    const expectedDependencies = [
      {
        source: 'pkg-one',
        target: 'pkg-two',
        type: DependencyType.PRODUCTION,
        version: '1.0.0',
      },
    ] satisfies Dependency[];

    expect(dependencies).toEqual(expectedDependencies);
  });
});
