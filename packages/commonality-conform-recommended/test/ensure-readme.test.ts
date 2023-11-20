import { describe, expect, it, vi } from 'vitest';
import { ensureReadme } from '../src/ensure-readme';

describe('ensureReadme', () => {
  describe('validate', () => {
    it('should return true if README.md exists', async () => {
      const text = vi.fn().mockImplementation(() => ({
        exists: () => true,
      }));

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
        text,
        json: vi.fn(),
        projectWorkspaces: [],
        workspace: workspace,
      });
      expect(result).toBe(true);
    });

    it('should return false if README.md does not exist', async () => {
      const text = vi.fn().mockImplementation(() => ({
        exists: () => false,
      }));

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
        text,
        json: vi.fn(),
        projectWorkspaces: [],
        workspace: workspace,
      });
      expect(result).toBe(false);
    });
  });

  describe('fix', () => {
    it('should create README.md with correct content', async () => {
      const setMock = vi.fn();
      const text = vi.fn().mockImplementation(() => ({
        set: setMock,
      }));

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
      await conformer?.fix?.({
        workspace,
        text,
        json: vi.fn(),
        projectWorkspaces: [],
      });

      expect(setMock).toHaveBeenCalledWith([
        '# workspaceName',
        '> workspaceDescription',
        '## Installation',
        '',
        '```sh',
        'npm install workspaceName',
        '```',
      ]);
    });
  });
});
