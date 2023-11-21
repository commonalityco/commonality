import { describe, expect, it, vi } from 'vitest';
import { ensurePackageName } from '../src/ensure-package-name';
import { json } from '@commonalityco/utils-file';

describe('ensurePackageName', () => {
  describe('validate', () => {
    it('should return false if package name is not present', async () => {
      const packageJson = {};
      const workspace = {
        path: '/path/to/workspace',
        tags: ['tag1', 'tag2'],
        codeowners: ['owner1', 'owner2'],
        packageJson,
      };

      const conformer = ensurePackageName();
      const result = await conformer.validate({
        workspace,
        json: () => json('package.json', { defaultSource: packageJson }),
        text: vi.fn(),
        projectWorkspaces: [],
      });

      expect(result).toBe(false);
    });

    it('should return true if package name is present', async () => {
      const packageJson = {
        name: 'workspaceName',
      };
      const workspace = {
        path: '/path/to/workspace',
        tags: ['tag1', 'tag2'],
        codeowners: ['owner1', 'owner2'],
        packageJson,
      };
      const conformer = ensurePackageName();
      const result = await conformer.validate({
        workspace,
        json: () =>
          json('package.json', {
            defaultSource: packageJson,
          }),
        text: vi.fn(),
        projectWorkspaces: [],
      });

      expect(result).toBe(true);
    });
  });
});
