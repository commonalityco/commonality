import stripAnsi from 'strip-ansi';
import { json } from '@commonalityco/utils-file';
import { devPeerDependencyRange } from './../src/dev-peer-dependency-range';
import { describe, it, vi, expect } from 'vitest';

describe('dev-peer-dependency-range', () => {
  describe('validate', () => {
    describe('when the peerDependency is not a devDependency', () => {
      it('should return false', async () => {
        const conformer = devPeerDependencyRange();

        const workspaceA = {
          path: '/path',
          tags: [],
          codeowners: [],
          packageJson: {
            name: 'pkg-a',
            peerDependencies: {
              'pkg-b': '>=18',
            },
          },
        };

        const result = await conformer.validate({
          projectWorkspaces: [workspaceA],
          workspace: workspaceA,
          json: vi.fn(),
          text: vi.fn(),
        });

        expect(result).toBe(false);
      });
    });

    describe('when the peerDependency is not a superset of the devDependency version', () => {
      it('should return false', async () => {
        const conformer = devPeerDependencyRange();

        const workspaceA = {
          path: '/path',
          tags: [],
          codeowners: [],
          packageJson: {
            name: 'pkg-a',
            devDependencies: {
              'pkg-b': '^17.0.2',
            },
            peerDependencies: {
              'pkg-b': '>=18',
            },
          },
        };

        const result = await conformer.validate({
          projectWorkspaces: [workspaceA],
          workspace: workspaceA,
          json: vi.fn(),
          text: vi.fn(),
        });

        expect(result).toBe(false);
      });
    });

    describe('when the peerDependency is a superset of the devDependency version', () => {
      it('should return true', async () => {
        const conformer = devPeerDependencyRange();

        const workspaceA = {
          path: '/path',
          tags: [],
          codeowners: [],
          packageJson: {
            name: 'pkg-a',
            devDependencies: {
              'pkg-b': '^18.0.5',
            },
            peerDependencies: {
              'pkg-b': '>=18',
            },
          },
        };

        const result = await conformer.validate({
          projectWorkspaces: [workspaceA],
          workspace: workspaceA,
          json: vi.fn(),
          text: vi.fn(),
        });

        expect(result).toBe(true);
      });
    });

    describe('when the peerDependency matches the devDependency', () => {
      it('should return true', async () => {
        const conformer = devPeerDependencyRange();

        const workspaceA = {
          path: '/path',
          tags: [],
          codeowners: [],
          packageJson: {
            name: 'pkg-a',
            devDependencies: {
              'pkg-b': '^18.0.5',
            },
            peerDependencies: {
              'pkg-b': '^18.0.5',
            },
          },
        };

        const result = await conformer.validate({
          projectWorkspaces: [workspaceA],
          workspace: workspaceA,
          json: vi.fn(),
          text: vi.fn(),
        });

        expect(result).toBe(true);
      });
    });

    describe('when the devDependency uses the workspace protocol with a semver range', () => {
      it('should return true', async () => {
        const conformer = devPeerDependencyRange();

        const workspaceA = {
          path: '/path',
          tags: [],
          codeowners: [],
          packageJson: {
            name: 'pkg-a',
            devDependencies: {
              'pkg-b': 'workspace:^18',
            },
            peerDependencies: {
              'pkg-b': 'workspace:>=18',
            },
          },
        };

        const result = await conformer.validate({
          projectWorkspaces: [workspaceA],
          workspace: workspaceA,
          json: vi.fn(),
          text: vi.fn(),
        });

        expect(result).toBe(true);
      });
    });

    describe('when the devDependency uses the workspace protocol with a wildcard', () => {
      it('should return true', async () => {
        const conformer = devPeerDependencyRange();

        const workspaceA = {
          path: '/path',
          tags: [],
          codeowners: [],
          packageJson: {
            name: 'pkg-a',
            devDependencies: {
              'pkg-b': 'workspace:*',
            },
            peerDependencies: {
              'pkg-b': '>=18',
            },
          },
        };

        const result = await conformer.validate({
          projectWorkspaces: [workspaceA],
          workspace: workspaceA,
          json: vi.fn(),
          text: vi.fn(),
        });

        expect(result).toBe(true);
      });
    });
  });

  describe('fix', () => {
    it('should write the minimum version of the peerDependency to the devDependency', async () => {
      const conformer = devPeerDependencyRange();

      const packageJson = {
        name: 'pkg-a',
        devDependencies: {
          'pkg-b': '^17.0.2',
        },
        peerDependencies: {
          'pkg-b': '>=18',
        },
      };
      const workspaceA = {
        path: '/path',
        tags: [],
        codeowners: [],
        packageJson,
      };

      const onWriteMock = vi.fn();

      await conformer.fix({
        projectWorkspaces: [workspaceA],
        workspace: workspaceA,
        text: vi.fn(),
        json: () =>
          json('package.json', {
            onWrite: onWriteMock,
            defaultSource: packageJson,
          }),
      });

      expect(onWriteMock).toHaveBeenCalledWith('package.json', {
        name: 'pkg-a',
        devDependencies: {
          'pkg-b': '^18.0.0',
        },
        peerDependencies: {
          'pkg-b': '>=18',
        },
      });
    });
  });

  describe('message', () => {
    it('should show the correct message', async () => {
      const conformer = devPeerDependencyRange();

      const packageJson = {
        name: 'pkg-a',
        devDependencies: {
          'pkg-b': '^17.0.2',
        },
        peerDependencies: {
          'pkg-b': '>=18',
        },
      };
      const workspaceA = {
        path: '/path',
        tags: [],
        codeowners: [],
        packageJson,
      };

      const result = await conformer.message({
        workspace: workspaceA,
        projectWorkspaces: [workspaceA],
        json: () => json('package.json', { defaultSource: packageJson }),
        text: vi.fn(),
      });

      expect(result.title).toEqual(
        'Packages with peerDependencies must have matching devDependencies within a valid range',
      );
      expect(stripAnsi(result.context ?? '')).toMatchInlineSnapshot(`
        "  Object {
            \\"devDependencies\\": Object {
              \\"pkg-b\\": \\"^17.0.2\\",
        +     \\"pkg-b\\": \\"^18.0.0\\",
            },
            \\"name\\": \\"pkg-a\\",
            \\"peerDependencies\\": Object {
              \\"pkg-b\\": \\">=18\\",
            },
          }"
      `);
    });
  });
});
