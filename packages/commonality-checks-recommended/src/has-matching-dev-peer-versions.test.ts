import hasMatchingDevPeerVersions from './has-matching-dev-peer-versions';
import { describe, it, expect, afterEach } from 'vitest';
import { defineTestCheck, json } from 'commonality';
import mockFs from 'mock-fs';

describe('hasMatchingDevPeerVersions', () => {
  afterEach(() => {
    mockFs.restore();
  });

  describe('validate', () => {
    describe('when the peerDependency is not a devDependency', () => {
      it('should return false', async () => {
        mockFs({
          'package.json': JSON.stringify({
            peerDependencies: {
              'pkg-b': '>=18',
            },
          }),
        });
        const conformer = defineTestCheck(hasMatchingDevPeerVersions);

        const result = await conformer.validate();

        // @ts-expect-error - expecting message object
        expect(result.message).toEqual(
          'Packages with peerDependencies must have matching devDependencies within a valid range',
        );
        // @ts-expect-error - expecting message object
        expect(result.path).toEqual('package.json');
        // @ts-expect-error - expecting message object
        expect(result.suggestion).toMatchInlineSnapshot(
          `
            "  Object {
                \\"devDependencies\\": undefined,
            +   \\"devDependencies\\": Object {
            +     \\"pkg-b\\": \\"^18.0.0\\",
            +   },
              }"
          `,
        );
      });
    });

    describe('when the peerDependency is not a superset of the devDependency version', () => {
      it('should return false', async () => {
        mockFs({
          'package.json': JSON.stringify({
            name: 'pkg-a',
            devDependencies: {
              'pkg-b': '^17.0.2',
            },
            peerDependencies: {
              'pkg-b': '>=18',
            },
          }),
        });
        const conformer = defineTestCheck(hasMatchingDevPeerVersions);
        const result = await conformer.validate();

        // @ts-expect-error - expecting message object
        expect(result.message).toEqual(
          'Packages with peerDependencies must have matching devDependencies within a valid range',
        );
        // @ts-expect-error - expecting message object
        expect(result.path).toEqual('package.json');
        // @ts-expect-error - expecting message object
        expect(result.suggestion).toMatchInlineSnapshot(`
          "  Object {
              \\"devDependencies\\": Object {
                \\"pkg-b\\": \\"^17.0.2\\",
          +     \\"pkg-b\\": \\"^18.0.0\\",
              },
            }"
        `);
      });
    });

    describe('when the peerDependency is a superset of the devDependency version', () => {
      it('should return true', async () => {
        mockFs({
          'package.json': JSON.stringify({
            name: 'pkg-a',
            devDependencies: {
              'pkg-b': '^18.0.5',
            },
            peerDependencies: {
              'pkg-b': '>=18',
            },
          }),
        });
        const conformer = defineTestCheck(hasMatchingDevPeerVersions);

        const result = await conformer.validate();

        expect(result).toBe(true);
      });
    });

    describe('when the peerDependency matches the devDependency', () => {
      it('should return true', async () => {
        mockFs({
          'package.json': JSON.stringify({
            name: 'pkg-a',
            devDependencies: {
              'pkg-b': '^18.0.5',
            },
            peerDependencies: {
              'pkg-b': '^18.0.5',
            },
          }),
        });
        const conformer = defineTestCheck(hasMatchingDevPeerVersions);

        const result = await conformer.validate();

        expect(result).toBe(true);
      });
    });

    describe('when the peerDependency intersects with the devDependency version range', () => {
      it('should return true', async () => {
        mockFs({
          'package.json': JSON.stringify({
            name: 'pkg-a',
            devDependencies: {
              'pkg-b': '^18.0.0',
            },
            peerDependencies: {
              'pkg-b': '>=18',
            },
          }),
        });
        const conformer = defineTestCheck(hasMatchingDevPeerVersions);

        const result = await conformer.validate();

        expect(result).toBe(true);
      });
    });

    describe('when the devDependency uses the workspace protocol with a semver range', () => {
      it('should return true', async () => {
        mockFs({
          'package.json': JSON.stringify({
            name: 'pkg-a',
            devDependencies: {
              'pkg-b': 'workspace:^18',
            },
            peerDependencies: {
              'pkg-b': 'workspace:>=18',
            },
          }),
        });
        const conformer = defineTestCheck(hasMatchingDevPeerVersions);

        const result = await conformer.validate();

        expect(result).toBe(true);
      });
    });

    describe('when the devDependency uses the workspace protocol with a wildcard', () => {
      it('should return true', async () => {
        mockFs({
          'package.json': JSON.stringify({
            name: 'pkg-a',
            devDependencies: {
              'pkg-b': 'workspace:*',
            },
            peerDependencies: {
              'pkg-b': '>=18',
            },
          }),
        });
        const conformer = defineTestCheck(hasMatchingDevPeerVersions);

        const result = await conformer.validate();

        expect(result).toBe(true);
      });
    });
  });

  describe('fix', () => {
    it('should write the minimum version of the peerDependency to the devDependency when it does not exist', async () => {
      mockFs({
        'package.json': JSON.stringify({
          name: 'pkg-a',
          devDependencies: {},
          peerDependencies: {
            'pkg-b': '>=18',
          },
        }),
      });
      const conformer = defineTestCheck(hasMatchingDevPeerVersions);

      await conformer.fix();

      const packageJson = await json('./', 'package.json').get();

      expect(packageJson).toEqual({
        name: 'pkg-a',
        devDependencies: {
          'pkg-b': '^18.0.0',
        },
        peerDependencies: {
          'pkg-b': '>=18',
        },
      });
    });

    it('should write the minimum version of the peerDependency to the devDependency when it exists', async () => {
      mockFs({
        'package.json': JSON.stringify({
          name: 'pkg-a',
          devDependencies: {},
          peerDependencies: {
            'pkg-b': '>=18',
          },
        }),
      });
      const conformer = defineTestCheck(hasMatchingDevPeerVersions);

      await conformer.fix();

      const packageJson = await json('./', 'package.json').get();

      expect(packageJson).toEqual({
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
});
