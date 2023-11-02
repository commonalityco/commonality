import { describe, expect, it, vi } from 'vitest';
import { ensureVersion } from '../src/ensure-version';

describe('ensureVersion', () => {
  describe('validate', () => {
    it('should return true if the dependency is not a dependency of the package at all', async () => {
      const options = {
        version: '1.0.0',
        dependencies: ['dep3'],
        type: ['production' as const, 'development' as const, 'peer' as const],
      };
      const workspace = {
        path: '/path/to/workspace',
        tags: ['tag1', 'tag2'],
        codeowners: ['owner1', 'owner2'],
        packageJson: {
          workspaces: ['workspace1', 'workspace2'],
          name: 'workspaceName',
          description: 'workspaceDescription',
          version: 'workspaceVersion',
          dependencies: { dep1: '1.0.0', dep2: '1.0.0' },
          devDependencies: { dep1: '1.0.0', dep2: '1.0.0' },
          peerDependencies: { dep1: '1.0.0', dep2: '1.0.0' },
        },
      };
      const conformer = ensureVersion(options);
      const result = await conformer.validate({
        workspace,
        json: vi.fn(),
        text: vi.fn(),
        yaml: vi.fn(),
        projectWorkspaces: [],
      });
      expect(result).toBe(true);
    });

    it('should return true if none of the dependencies in options.dependencies are present', async () => {
      const options = {
        version: '2.0.0',
        dependencies: ['dep3', 'dep4'],
        type: ['production' as const, 'development' as const, 'peer' as const],
      };
      const workspace = {
        path: '/path/to/workspace',
        tags: ['tag1', 'tag2'],
        codeowners: ['owner1', 'owner2'],
        packageJson: {
          workspaces: ['workspace1', 'workspace2'],
          name: 'workspaceName',
          description: 'workspaceDescription',
          version: 'workspaceVersion',
          dependencies: { dep1: '1.0.0', dep2: '1.0.0' },
          devDependencies: { dep1: '1.0.0', dep2: '1.0.0' },
          peerDependencies: { dep1: '1.0.0', dep2: '1.0.0' },
        },
      };
      const conformer = ensureVersion(options);
      const result = await conformer.validate({
        workspace,
        json: vi.fn(),
        text: vi.fn(),
        yaml: vi.fn(),
        projectWorkspaces: [],
      });
      expect(result).toBe(true); // This will fail with the current implementation
    });

    it('should return true if the package matches the options.version', async () => {
      const options = {
        version: '1.0.0',
        dependencies: ['dep1'],
        type: ['production' as const, 'development' as const, 'peer' as const],
      };
      const workspace = {
        path: '/path/to/workspace',
        tags: ['tag1', 'tag2'],
        codeowners: ['owner1', 'owner2'],
        packageJson: {
          workspaces: ['workspace1', 'workspace2'],
          name: 'workspaceName',
          description: 'workspaceDescription',
          version: 'workspaceVersion',
          dependencies: { dep1: '1.0.0', dep2: '1.0.0' },
          devDependencies: { dep1: '1.0.0', dep2: '1.0.0' },
          peerDependencies: { dep1: '1.0.0', dep2: '1.0.0' },
        },
      };
      const conformer = ensureVersion(options);
      const result = await conformer.validate({
        workspace,
        json: vi.fn(),
        text: vi.fn(),
        yaml: vi.fn(),
        projectWorkspaces: [],
      });
      expect(result).toBe(true);
    });

    it('should return false if the dependency exists in the package.json but does not match options.version', async () => {
      const options = {
        version: '2.0.0',
        dependencies: ['dep1'],
        type: ['production' as const, 'development' as const, 'peer' as const],
      };
      const workspace = {
        path: '/path/to/workspace',
        tags: ['tag1', 'tag2'],
        codeowners: ['owner1', 'owner2'],
        packageJson: {
          workspaces: ['workspace1', 'workspace2'],
          name: 'workspaceName',
          description: 'workspaceDescription',
          version: 'workspaceVersion',
          dependencies: { dep1: '1.0.0', dep2: '1.0.0' },
          devDependencies: { dep1: '1.0.0', dep2: '1.0.0' },
          peerDependencies: { dep1: '1.0.0', dep2: '1.0.0' },
        },
      };
      const conformer = ensureVersion(options);
      const result = await conformer.validate({
        workspace,
        json: vi.fn(),
        text: vi.fn(),
        yaml: vi.fn(),
        projectWorkspaces: [],
      });
      expect(result).toBe(false);
    });
  });

  describe('fix', () => {
    it('should fix version correctly', async () => {
      const options = {
        version: '1.0.0',
        dependencies: ['dep1', 'dep2'],
        type: ['production' as const, 'development' as const, 'peer' as const],
      };
      const workspace = {
        path: '/path/to/workspace',
        tags: ['tag1', 'tag2'],
        codeowners: ['owner1', 'owner2'],
        packageJson: {
          workspaces: ['workspace1', 'workspace2'],
          name: 'workspaceName',
          description: 'workspaceDescription',
          version: 'workspaceVersion',
          dependencies: { dep1: '0.9.0', dep2: '0.9.0', dep3: '2.0.0' },
          devDependencies: {
            dep1: '0.9.0',
            dep2: '0.9.0',
            'name.dep': '3.0.0',
          },
          peerDependencies: { dep1: '0.9.0', dep2: '0.9.0' },
        },
      };

      const setMock = vi.fn();
      const json = vi.fn().mockImplementation(() => ({
        set: setMock,
      }));

      const conformer = ensureVersion(options);

      await conformer?.fix?.({
        workspace,
        json,
        text: vi.fn(),
        yaml: vi.fn(),
        projectWorkspaces: [],
      });

      expect(setMock).toHaveBeenCalledTimes(6);
      expect(setMock).toHaveBeenCalledWith('dependencies.dep1', '1.0.0');
      expect(setMock).toHaveBeenCalledWith('dependencies.dep2', '1.0.0');
      expect(setMock).toHaveBeenCalledWith('devDependencies.dep1', '1.0.0');
      expect(setMock).toHaveBeenCalledWith('devDependencies.dep2', '1.0.0');
      expect(setMock).toHaveBeenCalledWith('peerDependencies.dep1', '1.0.0');
      expect(setMock).toHaveBeenCalledWith('peerDependencies.dep2', '1.0.0');
    });
  });

  describe('message', () => {
    it('should return correct message if options are provided', () => {
      const options = {
        version: '1.0.0',
        dependencies: ['dep1', 'dep2'],
        type: ['production' as const, 'development' as const, 'peer' as const],
      };
      const conformer = ensureVersion(options);
      expect(conformer.message).toBe(
        'Packages with dependencies ["dep1","dep2"] must match version 1.0.0',
      );
    });

    it('should return "Invalid version" if options are not provided', () => {
      const conformer = ensureVersion();
      expect(conformer.message).toBe('Invalid version');
    });
  });
});
