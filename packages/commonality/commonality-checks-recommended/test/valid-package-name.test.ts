import { afterEach, describe, expect, it } from 'vitest';
import { validPackageName } from '../src/valid-package-name';
import { createTestCheck } from 'commonality';
import mockFs from 'mock-fs';

describe('validPackageName', () => {
  afterEach(() => {
    mockFs.restore();
  });

  describe('validate', () => {
    it('should return false if package name is not present', async () => {
      mockFs({
        'package.json': JSON.stringify({}),
      });
      const conformer = createTestCheck(validPackageName());

      const result = await conformer.validate();

      expect(result).toBe(false);
    });

    it('should return true if package name is invalid', async () => {
      mockFs({
        'package.json': JSON.stringify({
          name: 'workspace-namE',
        }),
      });

      const conformer = createTestCheck(validPackageName());

      const result = await conformer.validate();

      expect(result).toBe(false);
    });

    it('should return true if package name is present', async () => {
      mockFs({
        'package.json': JSON.stringify({
          name: 'workspace-name',
        }),
      });

      const conformer = createTestCheck(validPackageName());

      const result = await conformer.validate();

      expect(result).toBe(true);
    });
  });
});
