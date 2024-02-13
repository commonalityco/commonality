import { getDependencies } from './get-dependencies.js';
import { describe, expect, it } from 'vitest';
import path from 'node:path';
import { DependencyType } from '@commonalityco/utils-core';
import { Dependency } from '@commonalityco/types';
import { fileURLToPath } from 'node:url';

describe('getDependencies', () => {
  it('should returns an empty array if package.json does not contain a name property', async () => {
    const rootDirectory = path.join(
      path.dirname(fileURLToPath(import.meta.url)),
      '.,/test/fixtures',
      'missing-name',
    );

    const dependencies = await getDependencies({ rootDirectory });

    expect(dependencies).toEqual([]);
  });

  it('should return a package object with correct properties that includes all dependencies', async () => {
    const rootDirectory = path.join(
      path.dirname(fileURLToPath(import.meta.url)),
      '.,/test/fixtures',
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
