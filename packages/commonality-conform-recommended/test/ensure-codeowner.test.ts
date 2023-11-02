import { describe, expect, it, vi } from 'vitest';
import { ensureCodeowner } from '../src/ensure-codeowner';

describe('ensureCodeowner', () => {
  describe('validate', () => {
    it('should return false if codeowners are not present', async () => {
      const workspace = {
        path: '/path/to/workspace',
        tags: ['tag1', 'tag2'],
        codeowners: [],
        packageJson: {
          dependencies: { 'b-dep': '1.0.0', 'a-dep': '1.0.0' },
          devDependencies: { 'b-dep': '1.0.0', 'a-dep': '1.0.0' },
          peerDependencies: { 'b-dep': '1.0.0', 'a-dep': '1.0.0' },
        },
      };

      const conformer = ensureCodeowner();
      const result = await conformer.validate({
        workspace,
        json: vi.fn(),
        yaml: vi.fn(),
        text: vi.fn(),
        projectWorkspaces: [],
      });
      expect(result).toBe(false);
    });

    it('should return true if codeowners are present', async () => {
      const workspace = {
        path: '/path/to/workspace',
        tags: ['tag1', 'tag2'],
        codeowners: ['owner1', 'owner2'],
        packageJson: {
          dependencies: { 'a-dep': '1.0.0', 'b-dep': '1.0.0' },
          devDependencies: { 'a-dep': '1.0.0', 'b-dep': '1.0.0' },
          peerDependencies: { 'a-dep': '1.0.0', 'b-dep': '1.0.0' },
        },
      };

      const conformer = ensureCodeowner();
      const result = await conformer.validate({
        workspace,
        json: vi.fn(),
        yaml: vi.fn(),
        text: vi.fn(),
        projectWorkspaces: [],
      });
      expect(result).toBe(true);
    });
  });
});
