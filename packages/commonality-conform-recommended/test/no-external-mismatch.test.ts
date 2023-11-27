import stripAnsi from 'strip-ansi';
import { describe, expect, it, vi } from 'vitest';
import { noExternalMismatch } from '../src/no-external-mismatch';
import { createTestConformer, json } from '@commonalityco/utils-file';

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

      const conformer = createTestConformer(noExternalMismatch(), {
        allWorkspaces: [workspaceA, workspaceB, workspaceC],
        workspace: workspaceA,
      });

      const result = await conformer.validate();

      expect(result).toEqual(true);
    });

    it('should return false when are external mismatches', async () => {
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

      const conformer = createTestConformer(noExternalMismatch(), {
        allWorkspaces: [workspaceA, workspaceB, workspaceC],
        workspace: workspaceA,
      });

      const result = await conformer.validate();

      expect(result).toEqual(false);
    });
  });

  describe('fix', () => {
    it('should write the correct versions to the package.json', async () => {
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

      const onWrite = vi.fn();
      const conformer = createTestConformer(noExternalMismatch(), {
        allWorkspaces: [workspaceA, workspaceB, workspaceC],
        workspace: workspaceA,
        onWrite,
      });

      await conformer.fix();

      expect(onWrite).toHaveBeenCalledWith('package.json', {
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

      const conformer = createTestConformer(noExternalMismatch(), {
        allWorkspaces: [workspaceA, workspaceB, workspaceC],
        workspace: workspaceA,
      });

      const result = await conformer.message();

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
