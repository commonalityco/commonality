import { describe, expect, it, vi } from 'vitest';
import { ensureReadme } from '../src/ensure-readme';
import { text } from '@commonalityco/utils-file';

const rootWorkspace = {
  path: '/root',
  relativePath: '.',
  packageJson: {
    name: 'root',
  },
};

describe('ensureReadme', () => {
  describe('validate', () => {
    it('should return true if README.md exists', async () => {
      const workspace = {
        path: '/path/to/workspace',
        relativePath: '',
        packageJson: {
          name: 'workspaceName',
          description: 'workspaceDescription',
        },
      };

      const conformer = ensureReadme();
      const result = await conformer.validate({
        text: () => text('README.md', { onExists: () => true }),
        json: vi.fn(),
        allWorkspaces: [],
        workspace: workspace,
        rootWorkspace,
        codeowners: [],
        tags: [],
      });
      expect(result).toBe(true);
    });

    it('should return false if README.md does not exist', async () => {
      const workspace = {
        path: '/path/to/workspace',
        relativePath: '',
        packageJson: {
          name: 'workspaceName',
          description: 'workspaceDescription',
        },
      };

      const conformer = ensureReadme();
      const result = await conformer.validate({
        text: () => text('README.md', { onExists: () => false }),
        json: vi.fn(),
        allWorkspaces: [],
        workspace: workspace,
        rootWorkspace,
        codeowners: [],
        tags: [],
      });
      expect(result).toBe(false);
    });
  });

  describe('fix', () => {
    it('should create README.md with correct content', async () => {
      const workspace = {
        path: '/path/to/workspace',
        relativePath: '',
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
        allWorkspaces: [],
        rootWorkspace,
        codeowners: [],
        tags: [],
      });

      expect(onWriteMock).toHaveBeenCalledWith(
        'README.md',
        expect.stringMatching('# workspaceName'),
      );
    });
  });
});
