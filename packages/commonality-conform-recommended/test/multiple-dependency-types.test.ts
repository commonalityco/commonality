import stripAnsi from 'strip-ansi';
import { multipleDependencyTypes } from './../src/multiple-dependency-types';
import { describe, it, expect, vi } from 'vitest';
import { json } from '@commonalityco/utils-file';

describe('multipleDependencyTypes', () => {
  describe('validate', () => {
    const conformer = multipleDependencyTypes();

    it('should return true if no dependencies are specified in multiple dependency types', async () => {
      const workspaceA = {
        tags: [],
        codeowners: [],
        path: 'packages/pkg-a',
        packageJson: {
          dependencies: {
            'pkg-a': '1.0.0',
          },
        },
      };
      const result = await conformer.validate({
        json: vi.fn(),
        text: vi.fn(),
        workspace: workspaceA,
        allWorkspaces: [workspaceA],
      });

      expect(result).toBe(true);
    });

    it('should return false if there is a matching dependency and devDependency', async () => {
      const workspaceA = {
        tags: [],
        codeowners: [],
        path: 'packages/pkg-a',
        packageJson: {
          dependencies: {
            'pkg-a': '1.0.0',
          },
          devDependencies: {
            'pkg-a': '1.0.0',
          },
        },
      };

      const result = await conformer.validate({
        json: vi.fn(),
        text: vi.fn(),
        workspace: workspaceA,
        allWorkspaces: [workspaceA],
      });

      expect(result).toBe(false);
    });

    it('should return false if there is a matching dependency and optionalDependency', async () => {
      const workspaceA = {
        tags: [],
        codeowners: [],
        path: 'packages/pkg-a',
        packageJson: {
          dependencies: {
            'pkg-a': '1.0.0',
          },
          optionalDependencies: {
            'pkg-a': '1.0.0',
          },
        },
      };

      const result = await conformer.validate({
        json: vi.fn(),
        text: vi.fn(),
        workspace: workspaceA,
        allWorkspaces: [workspaceA],
      });

      expect(result).toBe(false);
    });

    it('should return false if there is a matching dependency, optionalDependency, and devDependency', async () => {
      const workspaceA = {
        tags: [],
        codeowners: [],
        path: 'packages/pkg-a',
        packageJson: {
          dependencies: {
            'pkg-a': '1.0.0',
          },
          devDependencies: {
            'pkg-a': '1.0.0',
          },
          optionalDependencies: {
            'pkg-a': '1.0.0',
          },
        },
      };

      const result = await conformer.validate({
        json: vi.fn(),
        text: vi.fn(),
        workspace: workspaceA,
        allWorkspaces: [workspaceA],
      });

      expect(result).toBe(false);
    });
  });

  describe('fix', () => {
    it('should remove devDependency if also a dependency', async () => {
      const conformer = multipleDependencyTypes();

      const onWrite = vi.fn();

      const workspaceA = {
        tags: [],
        codeowners: [],
        path: 'packages/pkg-a',
        packageJson: {
          name: 'pkg-b',
          dependencies: {
            'pkg-a': '1.0.0',
          },
          devDependencies: {
            'pkg-a': '1.0.0',
          },
        },
      };

      await conformer.fix({
        json: () =>
          json('package.json', {
            defaultSource: workspaceA.packageJson,
            onWrite,
          }),
        text: vi.fn(),
        workspace: workspaceA,
        allWorkspaces: [workspaceA],
      });

      expect(onWrite).toHaveBeenCalledWith('package.json', {
        name: 'pkg-b',
        dependencies: {
          'pkg-a': '1.0.0',
        },
        devDependencies: {},
      });
    });

    it('should remove the optionalDependency if also a dependency', async () => {
      const conformer = multipleDependencyTypes();

      const onWrite = vi.fn();

      const workspaceA = {
        tags: [],
        codeowners: [],
        path: 'packages/pkg-a',
        packageJson: {
          name: 'pkg-b',
          dependencies: {
            'pkg-a': '1.0.0',
          },
          optionalDependencies: {
            'pkg-a': '1.0.0',
          },
        },
      };

      await conformer.fix({
        json: () =>
          json('package.json', {
            defaultSource: workspaceA.packageJson,
            onWrite,
          }),
        text: vi.fn(),
        workspace: workspaceA,
        allWorkspaces: [workspaceA],
      });

      expect(onWrite).toHaveBeenCalledWith('package.json', {
        name: 'pkg-b',
        dependencies: {
          'pkg-a': '1.0.0',
        },
        optionalDependencies: {},
      });
    });

    it('should remove the dependency if also a devDependency and optionalDependency', async () => {
      const conformer = multipleDependencyTypes();

      const onWrite = vi.fn();

      const workspaceA = {
        tags: [],
        codeowners: [],
        path: 'packages/pkg-a',
        packageJson: {
          name: 'pkg-b',
          dependencies: {
            'pkg-a': '1.0.0',
          },
          devDependencies: {
            'pkg-a': '1.0.0',
          },
          optionalDependencies: {
            'pkg-a': '1.0.0',
          },
        },
      };

      await conformer.fix({
        json: () =>
          json('package.json', {
            defaultSource: workspaceA.packageJson,
            onWrite,
          }),
        text: vi.fn(),
        workspace: workspaceA,
        allWorkspaces: [workspaceA],
      });

      expect(onWrite).toHaveBeenCalledWith('package.json', {
        name: 'pkg-b',
        dependencies: {},
        devDependencies: {
          'pkg-a': '1.0.0',
        },
        optionalDependencies: {
          'pkg-a': '1.0.0',
        },
      });
    });
  });

  describe('message', () => {
    it('should output the correct message', () => {
      const conformer = multipleDependencyTypes();

      const workspaceA = {
        tags: [],
        codeowners: [],
        path: 'packages/pkg-a',
        packageJson: {
          name: 'pkg-b',
          dependencies: {
            'pkg-a': '1.0.0',
          },
          devDependencies: {
            'pkg-a': '1.0.0',
          },
          optionalDependencies: {
            'pkg-a': '1.0.0',
          },
        },
      };

      const message = conformer.message({
        workspace: workspaceA,
        allWorkspaces: [workspaceA],
        json: vi.fn(),
        text: vi.fn(),
      });

      expect(message.title).toEqual(
        'A dependency should only be in one of dependencies, devDependencies, or optionalDependencies',
      );

      expect(stripAnsi(message.context ?? '')).toMatchInlineSnapshot(
        `
          "  Object {
              \\"dependencies\\": Object {
                \\"pkg-a\\": \\"1.0.0\\",
              },
          +   \\"dependencies\\": Object {},
              \\"devDependencies\\": Object {
                \\"pkg-a\\": \\"1.0.0\\",
              },
              \\"name\\": \\"pkg-b\\",
              \\"optionalDependencies\\": Object {
                \\"pkg-a\\": \\"1.0.0\\",
              },
            }"
        `,
      );
    });
  });
});
