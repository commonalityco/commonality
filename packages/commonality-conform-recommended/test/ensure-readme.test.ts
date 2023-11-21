import { describe, expect, it, vi } from 'vitest';
import { ensureReadme } from '../src/ensure-readme';
import { text } from '@commonalityco/utils-file';

describe('ensureReadme', () => {
  describe('validate', () => {
    it('should return true if README.md exists', async () => {
      const workspace = {
        path: '/path/to/workspace',
        tags: ['tag1', 'tag2'],
        codeowners: ['owner1', 'owner2'],
        packageJson: {
          name: 'workspaceName',
          description: 'workspaceDescription',
        },
      };

      const conformer = ensureReadme();
      const result = await conformer.validate({
        text: () => text('README.md', { onExists: () => true }),
        json: vi.fn(),
        projectWorkspaces: [],
        workspace: workspace,
      });
      expect(result).toBe(true);
    });

    it('should return false if README.md does not exist', async () => {
      const workspace = {
        path: '/path/to/workspace',
        tags: ['tag1', 'tag2'],
        codeowners: ['owner1', 'owner2'],
        packageJson: {
          name: 'workspaceName',
          description: 'workspaceDescription',
        },
      };

      const conformer = ensureReadme();
      const result = await conformer.validate({
        text: () => text('README.md', { onExists: () => false }),
        json: vi.fn(),
        projectWorkspaces: [],
        workspace: workspace,
      });
      expect(result).toBe(false);
    });
  });

  describe('fix', () => {
    it('should create README.md with correct content', async () => {
      const workspace = {
        path: '/path/to/workspace',
        tags: ['tag1', 'tag2'],
        codeowners: ['owner1', 'owner2'],
        packageJson: {
          name: 'workspaceName',
          description: 'workspaceDescription',
        },
      };

      const conformer = ensureReadme();

      const onWriteMock = vi.fn();
      await conformer?.fix?.({
        workspace,
        text: () => text('README.md', { onWrite: onWriteMock }),
        json: vi.fn(),
        projectWorkspaces: [],
      });

      expect(onWriteMock).toHaveBeenCalledWith(
        'README.md',
        expect.stringMatching('# workspaceName'),
      );
    });
  });
});
