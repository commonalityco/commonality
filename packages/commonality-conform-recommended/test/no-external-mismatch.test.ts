import stripAnsi from 'strip-ansi';
import { describe, expect, it, vi } from 'vitest';
import { noExternalMismatch } from '../src/no-external-mismatch';
import { json } from '@commonalityco/utils-file';

const rootWorkspace = {
  path: '/root',
  relativePath: '.',
  packageJson: {
    name: 'root',
  },
};

describe('no-external-mismatch', () => {
  describe('validate', () => {
    it('should return true when there are no external mismatches', async () => {
      const conformer = noExternalMismatch();
      const workspaceA = {
        path: '',
        relativePath: '',
        packageJson: {
          name: 'package1',
          dependencies: {
            package3: '1.0.0',
          },
          devDependencies: {},
          peerDependencies: {},
        },
      };
      const workspaceB = {
        path: '',
        relativePath: '',
        packageJson: {
          name: 'package2',
          dependencies: {
            package3: '1.0.0',
          },
          devDependencies: {},
          peerDependencies: {},
        },
      };
      const workspaceC = {
        path: '',
        relativePath: '',
        packageJson: {
          name: 'package3',
          dependencies: {},
          devDependencies: {
            package3: '1.0.0',
          },
          peerDependencies: {},
        },
      };

      const result = await conformer.validate({
        allWorkspaces: [workspaceA, workspaceB, workspaceC],
        json: vi.fn(),
        text: vi.fn(),
        workspace: workspaceA,
        tags: [],
        codeowners: [],
        rootWorkspace,
      });

      expect(result).toEqual(true);
    });

    it('should return false when are external mismatches', async () => {
      const conformer = noExternalMismatch();
      const workspaceA = {
        path: '',
        relativePath: '',
        packageJson: {
          name: 'packageA',
          dependencies: {
            package3: '3.0.0',
          },
          devDependencies: {},
          peerDependencies: {},
        },
      };
      const workspaceB = {
        path: '',
        relativePath: '',
        packageJson: {
          name: 'packageB',
          dependencies: {
            package3: '1.0.0',
          },
          devDependencies: {},
          peerDependencies: {},
        },
      };
      const workspaceC = {
        path: '',
        relativePath: '',
        packageJson: {
          name: 'packageC',
          dependencies: {},
          devDependencies: {
            package3: '1.0.0',
          },
          peerDependencies: {},
        },
      };

      const result = await conformer.validate({
        allWorkspaces: [workspaceA, workspaceB, workspaceC],
        json: vi.fn(),
        text: vi.fn(),
        workspace: workspaceA,
        tags: [],
        codeowners: [],
        rootWorkspace,
      });

      expect(result).toEqual(false);
    });
  });

  describe('fix', () => {
    it('should write the correct versions to the package.json', async () => {
      const conformer = noExternalMismatch();

      const workspaceA = {
        path: '',
        relativePath: '',
        packageJson: {
          name: 'packageA',
          dependencies: {
            package3: '3.0.0',
          },
          devDependencies: {},
          peerDependencies: {},
        },
      };
      const workspaceB = {
        path: '',
        relativePath: '',
        packageJson: {
          name: 'packageB',
          dependencies: {
            package3: '1.0.0',
          },
          devDependencies: {},
          peerDependencies: {},
        },
      };
      const workspaceC = {
        path: '',
        relativePath: '',
        packageJson: {
          name: 'packageC',
          dependencies: {},
          devDependencies: {
            package3: '1.0.0',
          },
          peerDependencies: {},
        },
      };

      const mockOnWrite = vi.fn();

      await conformer.fix({
        json: () =>
          json('package.json', {
            onWrite: mockOnWrite,
            defaultSource: workspaceA.packageJson,
          }),
        text: vi.fn(),
        allWorkspaces: [workspaceA, workspaceB, workspaceC],
        workspace: workspaceA,
        tags: [],
        codeowners: [],
        rootWorkspace,
      });

      expect(mockOnWrite).toHaveBeenCalledWith('package.json', {
        name: 'packageA',
        dependencies: {
          package3: '1.0.0',
        },
        devDependencies: {},
        peerDependencies: {},
      });
    });
  });

  describe('message', () => {
    it('should return the correct message', async () => {
      const conformer = noExternalMismatch();

      const workspaceA = {
        path: '',
        relativePath: '',
        packageJson: {
          name: 'package-a',
          dependencies: {
            'package-b': 'workspace:*',
            package3: '3.0.0',
          },
          devDependencies: {},
          peerDependencies: {},
        },
      };
      const workspaceB = {
        path: '',
        relativePath: '',
        packageJson: {
          name: 'package-b',
          dependencies: {
            package3: '1.0.0',
          },
          devDependencies: {},
          peerDependencies: {},
        },
      };
      const workspaceC = {
        path: '',
        relativePath: '',
        packageJson: {
          name: 'package-c',
          dependencies: {},
          devDependencies: {
            package3: '1.0.0',
          },
          peerDependencies: {},
        },
      };

      const result = await conformer.message({
        json: () =>
          json('package.json', {
            defaultSource: workspaceA.packageJson,
          }),
        text: vi.fn(),
        allWorkspaces: [workspaceA, workspaceB, workspaceC],
        workspace: workspaceA,
        tags: [],
        codeowners: [],
        rootWorkspace,
      });

      expect(stripAnsi(result.context ?? '')).toMatchInlineSnapshot(`
        "  Object {
            \\"dependencies\\": Object {
              \\"package-b\\": \\"workspace:*\\",
              \\"package3\\": \\"3.0.0\\",
        +     \\"package3\\": \\"1.0.0\\",
            },
            \\"devDependencies\\": Object {},
            \\"name\\": \\"package-a\\",
            \\"peerDependencies\\": Object {},
          }"
      `);
    });
  });
});
