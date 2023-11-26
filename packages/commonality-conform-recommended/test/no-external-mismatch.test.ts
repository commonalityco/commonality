import stripAnsi from 'strip-ansi';
import { describe, expect, it, vi } from 'vitest';
import { noExternalMismatch } from '../src/no-external-mismatch';
import { json } from '@commonalityco/utils-file';

describe('no-external-mismatch', () => {
  describe('validate', () => {
    it('should return true when there are no external mismatches', async () => {
      const conformer = noExternalMismatch();
      const workspaceA = {
        path: '',
        tags: [],
        codeowners: [],
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
        tags: [],
        codeowners: [],
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
        tags: [],
        codeowners: [],
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
        projectWorkspaces: [workspaceA, workspaceB, workspaceC],
        json: vi.fn(),
        text: vi.fn(),
        workspace: workspaceA,
      });

      expect(result).toEqual(true);
    });

    it('should return false when are external mismatches', async () => {
      const conformer = noExternalMismatch();
      const workspaceA = {
        path: '',
        tags: [],
        codeowners: [],
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
        tags: [],
        codeowners: [],
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
        tags: [],
        codeowners: [],
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
        projectWorkspaces: [workspaceA, workspaceB, workspaceC],
        json: vi.fn(),
        text: vi.fn(),
        workspace: workspaceA,
      });

      expect(result).toEqual(false);
    });
  });

  describe('fix', () => {
    it('should write the correct versions to the package.json', async () => {
      const conformer = noExternalMismatch();

      const workspaceA = {
        path: '',
        tags: [],
        codeowners: [],
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
        tags: [],
        codeowners: [],
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
        tags: [],
        codeowners: [],
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
        projectWorkspaces: [workspaceA, workspaceB, workspaceC],
        workspace: workspaceA,
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
        tags: [],
        codeowners: [],
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
        tags: [],
        codeowners: [],
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
        tags: [],
        codeowners: [],
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
        projectWorkspaces: [workspaceA, workspaceB, workspaceC],
        workspace: workspaceA,
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
