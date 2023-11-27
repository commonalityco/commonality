import { describe, expect, it } from 'vitest';
import { validPackageName } from '../src/valid-package-name';
import { createTestConformer } from '@commonalityco/utils-file';

describe('validPackageName', () => {
  describe('validate', () => {
    it('should return false if package name is not present', async () => {
      const conformer = createTestConformer(validPackageName(), {
        files: {
          'package.json': {},
        },
      });

      const result = await conformer.validate();

      expect(result).toBe(false);
    });

    it('should return true if package name is invalid', async () => {
      const conformer = createTestConformer(validPackageName(), {
        files: {
          'package.json': {
            name: 'workspace-namE',
          },
        },
      });

      const result = await conformer.validate();

      expect(result).toBe(false);
    });

    it('should return true if package name is present', async () => {
      const conformer = createTestConformer(validPackageName(), {
        files: {
          'package.json': {
            name: 'workspace-name',
          },
        },
      });

      const result = await conformer.validate();

      expect(result).toBe(true);
    });
  });
});
