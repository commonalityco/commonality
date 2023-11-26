import { describe, expect, it, vi } from 'vitest';
import { ensureCodeowner } from '../src/ensure-codeowner';

describe('ensureCodeowner', () => {
  describe('validate', () => {
    it('should return false if codeowners are not present', async () => {
      const workspace = {
        path: '/path/to/workspace',
        tags: ['tag1', 'tag2'],
        codeowners: [],
        packageJson: {},
      };

      const conformer = ensureCodeowner();
      const result = await conformer.validate({
        workspace,
        json: vi.fn(),
        text: vi.fn(),
        allWorkspaces: [],
      });
      expect(result).toBe(false);
    });

    it('should return true if codeowners are present', async () => {
      const workspace = {
        path: '/path/to/workspace',
        tags: ['tag1', 'tag2'],
        codeowners: ['owner1', 'owner2'],
        packageJson: {},
      };

      const conformer = ensureCodeowner();
      const result = await conformer.validate({
        workspace,
        json: vi.fn(),
        text: vi.fn(),
        allWorkspaces: [],
      });
      expect(result).toBe(true);
    });
  });
});
