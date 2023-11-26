import { describe, expect, it, vi } from 'vitest';
import { validPackageName } from '../src/valid-package-name';
import { json } from '@commonalityco/utils-file';

describe('validPackageName', () => {
  describe('validate', () => {
    it('should return false if package name is not present', async () => {
      const packageJson = {};
      const workspace = {
        path: '/path/to/workspace',
        tags: ['tag1', 'tag2'],
        codeowners: ['owner1', 'owner2'],
        packageJson,
      };

      const conformer = validPackageName();
      const result = await conformer.validate({
        workspace,
        json: () => json('package.json', { defaultSource: packageJson }),
        text: vi.fn(),
        allWorkspaces: [],
      });

      expect(result).toBe(false);
    });

    it('should return true if package name is invalid', async () => {
      const packageJson = {
        name: 'workspace-namE',
      };
      const workspace = {
        path: '/path/to/workspace',
        tags: ['tag1', 'tag2'],
        codeowners: ['owner1', 'owner2'],
        packageJson,
      };
      const conformer = validPackageName();
      const result = await conformer.validate({
        workspace,
        json: () =>
          json('package.json', {
            defaultSource: packageJson,
          }),
        text: vi.fn(),
        allWorkspaces: [],
      });

      expect(result).toBe(false);
    });

    it('should return true if package name is present', async () => {
      const packageJson = {
        name: 'workspace-name',
      };
      const workspace = {
        path: '/path/to/workspace',
        tags: ['tag1', 'tag2'],
        codeowners: ['owner1', 'owner2'],
        packageJson,
      };
      const conformer = validPackageName();
      const result = await conformer.validate({
        workspace,
        json: () =>
          json('package.json', {
            defaultSource: packageJson,
          }),
        text: vi.fn(),
        allWorkspaces: [],
      });

      expect(result).toBe(true);
    });
  });
});
