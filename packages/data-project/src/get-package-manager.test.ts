import { PackageManager } from '@commonalityco/utils-core';
import path from 'path';
import { getPackageManager } from './get-package-manager';
import { describe, expect, it } from 'vitest';

describe('getPackageManager', () => {
  describe('when run in an un-initialized project', () => {
    it('should throw an error', async () => {
      const rootDirectory = path.join(
        __dirname,
        '../fixtures',
        'uninitialized'
      );

      await expect(getPackageManager({ rootDirectory })).rejects.toThrow();
    });
  });

  describe('when run in an initialized project', () => {
    it(`should return ${PackageManager.NPM} for an NPM workspace`, async () => {
      const rootDirectory = path.join(
        __dirname,
        '../fixtures',
        'npm-workspace'
      );
      const packageManager = await getPackageManager({ rootDirectory });

      expect(packageManager).toEqual(PackageManager.NPM);
    });

    it(`should return ${PackageManager.YARN} for an Yarn workspace`, async () => {
      const rootDirectory = path.join(
        __dirname,
        '../fixtures',
        'yarn-workspace'
      );
      const packageManager = await getPackageManager({ rootDirectory });

      expect(packageManager).toEqual(PackageManager.YARN);
    });

    it(`should return ${PackageManager.PNPM} for an pnpm workspace`, async () => {
      const rootDirectory = path.join(
        __dirname,
        '../fixtures',
        'pnpm-workspace'
      );
      const packageManager = await getPackageManager({ rootDirectory });

      expect(packageManager).toEqual(PackageManager.PNPM);
    });
  });
});
