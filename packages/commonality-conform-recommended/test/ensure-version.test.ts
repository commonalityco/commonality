import { json } from '@commonalityco/utils-file';
import { describe, expect, it, vi } from 'vitest';
import { ensureVersion } from '../src/ensure-version';
import stripAnsi from 'strip-ansi';

describe('ensureVersion', () => {
  describe('validate', () => {
    it('should return true if the dependency is not a dependency of the package at all', async () => {
      const options = {
        version: '1.0.0',
        dependencies: ['dep3'],
        type: ['production' as const, 'development' as const, 'peer' as const],
      };
      const packageJson = {
        name: 'workspaceName',
        version: '1.0.0',
        dependencies: { dep1: '1.0.0', dep2: '1.0.0' },
        devDependencies: { dep1: '1.0.0', dep2: '1.0.0' },
        peerDependencies: { dep1: '1.0.0', dep2: '1.0.0' },
      };
      const workspace = {
        path: '/path/to/workspace',
        tags: ['tag1', 'tag2'],
        codeowners: ['owner1', 'owner2'],
        packageJson,
      };
      const conformer = ensureVersion(options);
      const result = await conformer.validate({
        workspace,
        json: () => json('package.json', { defaultSource: packageJson }),
        text: vi.fn(),
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
      const packageJson = {
        name: 'workspaceName',
        version: '1.0.0',
        dependencies: { dep1: '1.0.0', dep2: '1.0.0' },
        devDependencies: { dep1: '1.0.0', dep2: '1.0.0' },
        peerDependencies: { dep1: '1.0.0', dep2: '1.0.0' },
      };
      const workspace = {
        path: '/path/to/workspace',
        tags: ['tag1', 'tag2'],
        codeowners: ['owner1', 'owner2'],
        packageJson,
      };
      const conformer = ensureVersion(options);
      const result = await conformer.validate({
        workspace,
        json: () => json('package.json', { defaultSource: packageJson }),
        text: vi.fn(),
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
      const packageJson = {
        name: 'workspaceName',
        version: '1.0.0',
        dependencies: { dep1: '1.0.0', dep2: '1.0.0' },
        devDependencies: { dep1: '1.0.0', dep2: '1.0.0' },
        peerDependencies: { dep1: '1.0.0', dep2: '1.0.0' },
      };
      const workspace = {
        path: '/path/to/workspace',
        tags: ['tag1', 'tag2'],
        codeowners: ['owner1', 'owner2'],
        packageJson,
      };
      const conformer = ensureVersion(options);
      const result = await conformer.validate({
        workspace,
        json: () => json('package.json', { defaultSource: packageJson }),
        text: vi.fn(),
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
      const packageJson = {
        name: 'workspaceName',
        version: '1.0.0',
        dependencies: { dep1: '1.0.0', dep2: '1.0.0' },
        devDependencies: { dep1: '1.0.0', dep2: '1.0.0' },
        peerDependencies: { dep1: '1.0.0', dep2: '1.0.0' },
      };
      const workspace = {
        path: '/path/to/workspace',
        tags: ['tag1', 'tag2'],
        codeowners: ['owner1', 'owner2'],
        packageJson,
      };
      const conformer = ensureVersion(options);
      const result = await conformer.validate({
        workspace,
        json: () => json('package.json', { defaultSource: packageJson }),
        text: vi.fn(),
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
      const packageJson = {
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
      };
      const workspace = {
        path: '/path/to/workspace',
        tags: ['tag1', 'tag2'],
        codeowners: ['owner1', 'owner2'],
        packageJson,
      };

      const conformer = ensureVersion(options);

      const onWrite = vi.fn();
      await conformer?.fix?.({
        workspace,
        json: () =>
          json('package.json', {
            defaultSource: packageJson,
            onWrite,
            onDelete: vi.fn(),
          }),
        text: vi.fn(),
        projectWorkspaces: [],
      });

      expect(onWrite).toHaveBeenCalledWith('package.json', {
        workspaces: ['workspace1', 'workspace2'],
        name: 'workspaceName',
        description: 'workspaceDescription',
        version: 'workspaceVersion',
        dependencies: { dep1: '1.0.0', dep2: '1.0.0', dep3: '2.0.0' },
        devDependencies: {
          dep1: '1.0.0',
          dep2: '1.0.0',
          'name.dep': '3.0.0',
        },
        peerDependencies: { dep1: '1.0.0', dep2: '1.0.0' },
      });
    });
  });

  describe('message', () => {
    it('should return correct message if no matching dependencies are found', async () => {
      const options = {
        version: '1.0.0',
        dependencies: ['dep1', 'dep2'],
        type: ['production' as const, 'development' as const, 'peer' as const],
      };
      const packageJson = {
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
      };
      const workspace = {
        path: '/path/to/workspace',
        tags: ['tag1', 'tag2'],
        codeowners: ['owner1', 'owner2'],
        packageJson,
      };

      const conformer = ensureVersion(options);

      const message = await conformer.message({
        workspace,
        json: () => json('package.json', { defaultSource: packageJson }),
        text: vi.fn(),
      });

      expect(message.title).toEqual(
        'Packages with dependencies ["dep1","dep2"] must match version 1.0.0',
      );
      expect(stripAnsi(message.context ?? '')).toMatchInlineSnapshot(
        `
          "  Object {
              \\"dependencies\\": Object {
                \\"dep1\\": \\"0.9.0\\",
                \\"dep2\\": \\"0.9.0\\",
          +     \\"dep1\\": \\"1.0.0\\",
          +     \\"dep2\\": \\"1.0.0\\",
              },
              \\"devDependencies\\": Object {
                \\"dep1\\": \\"0.9.0\\",
                \\"dep2\\": \\"0.9.0\\",
          +     \\"dep1\\": \\"1.0.0\\",
          +     \\"dep2\\": \\"1.0.0\\",
              },
              \\"peerDependencies\\": Object {
                \\"dep1\\": \\"0.9.0\\",
                \\"dep2\\": \\"0.9.0\\",
          +     \\"dep1\\": \\"1.0.0\\",
          +     \\"dep2\\": \\"1.0.0\\",
              },
            }"
        `,
      );
      expect(message.filepath).toMatch('package.json');
    });

    it('should return the correct message is there is a partial match', async () => {
      const options = {
        version: '1.0.0',
        dependencies: ['dep1', 'dep2'],
        type: ['production' as const, 'development' as const, 'peer' as const],
      };
      const packageJson = {
        workspaces: ['workspace1', 'workspace2'],
        name: 'workspaceName',
        description: 'workspaceDescription',
        version: 'workspaceVersion',
        devDependencies: {
          dep1: '1.0.0',
          dep2: '1.0.0',
        },
        peerDependencies: { dep1: '1.0.0', dep2: '1.0.0' },
      };
      const workspace = {
        path: '/path/to/workspace',
        tags: ['tag1', 'tag2'],
        codeowners: ['owner1', 'owner2'],
        packageJson,
      };

      const conformer = ensureVersion(options);

      const message = await conformer.message({
        workspace,
        json: () => json('package.json', { defaultSource: packageJson }),
        text: vi.fn(),
      });

      expect(message.title).toEqual(
        'Packages with dependencies ["dep1","dep2"] must match version 1.0.0',
      );
      expect(stripAnsi(message.context ?? '')).toMatchInlineSnapshot(`
        "{
          \\"devDependencies\\": {
            \\"dep1\\": \\"1.0.0\\",
            \\"dep2\\": \\"1.0.0\\"
          },
          \\"peerDependencies\\": {
            \\"dep1\\": \\"1.0.0\\",
            \\"dep2\\": \\"1.0.0\\"
          }
        }"
      `);
      expect(message.filepath).toMatch('package.json');
    });
  });
});
