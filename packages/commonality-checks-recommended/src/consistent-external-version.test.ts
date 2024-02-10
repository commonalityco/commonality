import { afterEach, describe, expect, it } from 'vitest';
import hasConsistentExternalVersion from './consistent-external-version';
import { defineTestCheck, json } from 'commonality';
import mockFs from 'mock-fs';

describe('consistent-external-version', () => {
  afterEach(() => {
    mockFs.restore();
  });

  describe('validate', () => {
    it('should return true when there are no external mismatches', async () => {
      mockFs({
        packages: {
          'pkg-a': {
            'package.json': JSON.stringify({
              name: 'pkg-a',
              dependencies: {
                package3: '1.0.0',
              },
              devDependencies: {},
              peerDependencies: {},
            }),
          },
          'pkg-b': {
            'package.json': JSON.stringify({
              name: 'pkg-b',
              dependencies: {
                package3: '1.0.0',
              },
              devDependencies: {},
              peerDependencies: {},
            }),
          },
          'pkg-c': {
            'package.json': JSON.stringify({
              name: 'pkg-c',
              dependencies: {},
              devDependencies: {
                package3: '1.0.0',
              },
              peerDependencies: {},
            }),
          },
        },
      });

      const conformer = defineTestCheck(hasConsistentExternalVersion, {
        allWorkspaces: [
          { path: './packages/pkg-a', relativePath: './packages/pkg-a' },
          { path: './packages/pkg-b', relativePath: './packages/pkg-b' },
          { path: './packages/pkg-c', relativePath: './packages/pkg-c' },
        ],
        workspace: {
          path: './packages/pkg-a',
          relativePath: './packages/pkg-a',
        },
      });

      const result = await conformer.validate();

      expect(result).toEqual(true);
    });

    it('should return false when are external mismatches', async () => {
      mockFs({
        packages: {
          'pkg-a': {
            'package.json': JSON.stringify({
              name: 'pkg-a',
              dependencies: {
                package3: '3.0.0',
              },
              devDependencies: {},
              peerDependencies: {},
            }),
          },
          'pkg-b': {
            'package.json': JSON.stringify({
              name: 'pkg-b',
              dependencies: {
                package3: '1.0.0',
              },
              devDependencies: {},
              peerDependencies: {},
            }),
          },
          'pkg-c': {
            'package.json': JSON.stringify({
              name: 'pkg-c',
              dependencies: {},
              devDependencies: {
                package3: '1.0.0',
              },
              peerDependencies: {},
            }),
          },
        },
      });

      const conformer = defineTestCheck(hasConsistentExternalVersion, {
        allWorkspaces: [
          { path: './packages/pkg-a', relativePath: './packages/pkg-a' },
          { path: './packages/pkg-b', relativePath: './packages/pkg-b' },
          { path: './packages/pkg-c', relativePath: './packages/pkg-c' },
        ],
        workspace: {
          path: './packages/pkg-a',
          relativePath: './packages/pkg-a',
        },
      });

      const result = await conformer.validate();

      // @ts-expect-error expecting message object
      expect(result.path).toEqual('package.json');
      // @ts-expect-error expecting message object
      expect(result.suggestion).toMatchInlineSnapshot(`
        "  Object {
            \\"dependencies\\": Object {
              \\"package3\\": \\"3.0.0\\",
        +     \\"package3\\": \\"1.0.0\\",
            },
            \\"devDependencies\\": Object {},
          }"
      `);
    });
  });

  describe('fix', () => {
    it('should write the correct versions to the package.json when the workspace has a mismatched dependency', async () => {
      mockFs({
        packages: {
          'pkg-a': {
            'package.json': JSON.stringify({
              name: 'pkg-a',
              dependencies: {
                package3: '3.0.0',
              },
              devDependencies: {},
              peerDependencies: {},
            }),
          },
          'pkg-b': {
            'package.json': JSON.stringify({
              name: 'pkg-b',
              dependencies: {
                package3: '1.0.0',
              },
              devDependencies: {},
              peerDependencies: {},
            }),
          },
          'pkg-c': {
            'package.json': JSON.stringify({
              name: 'pkg-c',
              dependencies: {},
              devDependencies: {
                package3: '1.0.0',
              },
              peerDependencies: {},
            }),
          },
        },
      });

      const conformer = defineTestCheck(hasConsistentExternalVersion, {
        allWorkspaces: [
          { path: './packages/pkg-a', relativePath: './packages/pkg-a' },
          { path: './packages/pkg-b', relativePath: './packages/pkg-b' },
          { path: './packages/pkg-c', relativePath: './packages/pkg-c' },
        ],
        workspace: {
          path: './packages/pkg-a',
          relativePath: './packages/pkg-a',
        },
      });

      await conformer.validate;

      const pkgAResult = await json(
        './',
        './packages/pkg-a/package.json',
      ).get();

      expect(pkgAResult).toEqual({
        name: 'pkg-a',
        dependencies: {
          package3: '1.0.0',
        },
        devDependencies: {},
        peerDependencies: {},
      });
    });

    it('should write the correct versions to the package.json when the workspace has a mismatched dependency', async () => {
      mockFs({
        packages: {
          'pkg-a': {
            'package.json': JSON.stringify({
              name: 'pkg-a',
              dependencies: {
                package3: '^1.0.1',
              },
              devDependencies: {},
              peerDependencies: {},
            }),
          },
          'pkg-b': {
            'package.json': JSON.stringify({
              name: 'pkg-b',
              dependencies: {
                package3: '^1.0.0',
              },
              devDependencies: {},
              peerDependencies: {},
            }),
          },
          'pkg-c': {
            'package.json': JSON.stringify({
              name: 'pkg-c',
              dependencies: {},
              devDependencies: {
                package3: '^1.0.0',
              },
              peerDependencies: {},
            }),
          },
          'pkg-d': {
            'package.json': JSON.stringify({
              name: 'pkg-d',
              dependencies: {},
              devDependencies: {
                package3: '^1.0.0',
              },
              peerDependencies: {},
            }),
          },
          'pkg-e': {
            'package.json': JSON.stringify({
              name: 'pkg-e',
              dependencies: {},
              devDependencies: {
                package3: '^1.0.1',
              },
              peerDependencies: {},
            }),
          },
        },
      });

      const conformer = defineTestCheck(hasConsistentExternalVersion, {
        allWorkspaces: [
          { path: './packages/pkg-a', relativePath: './packages/pkg-a' },
          { path: './packages/pkg-b', relativePath: './packages/pkg-b' },
          { path: './packages/pkg-c', relativePath: './packages/pkg-c' },
          { path: './packages/pkg-d', relativePath: './packages/pkg-d' },
          { path: './packages/pkg-e', relativePath: './packages/pkg-e' },
        ],
        workspace: {
          path: './packages/pkg-e',
          relativePath: './packages/pkg-e',
        },
      });

      await conformer.fix();

      const pkgEResult = await json(
        './',
        './packages/pkg-e/package.json',
      ).get();

      expect(pkgEResult).toEqual({
        name: 'pkg-e',
        dependencies: {},
        devDependencies: {
          package3: '^1.0.0',
        },
        peerDependencies: {},
      });
    });
  });
});
