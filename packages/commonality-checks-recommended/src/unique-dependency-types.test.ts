import hasUniqueDependencyTypes from './unique-dependency-types';
import { describe, it, expect, afterEach } from 'vitest';
import { defineTestCheck, json } from 'commonality';
import mockFs from 'mock-fs';

describe('unique-dependency-types', () => {
  afterEach(() => {
    mockFs.restore();
  });

  describe('validate', () => {
    it('should return true if no dependencies are specified in multiple dependency types', async () => {
      mockFs({
        'package.json': JSON.stringify({
          dependencies: {
            'pkg-a': '1.0.0',
          },
        }),
      });
      const conformer = defineTestCheck(hasUniqueDependencyTypes);

      const result = await conformer.validate();

      expect(result).toBe(true);
    });

    it('should return a message object if there is a matching dependency and devDependency', async () => {
      mockFs({
        'package.json': JSON.stringify({
          dependencies: {
            'pkg-a': '1.0.0',
          },
          devDependencies: {
            'pkg-a': '1.0.0',
          },
        }),
      });

      const conformer = defineTestCheck(hasUniqueDependencyTypes);
      const result = await conformer.validate();

      // @ts-expect-error - expecting message object
      expect(result.message).toEqual(undefined);
      // @ts-expect-error - expecting message object
      expect(result.path).toEqual('package.json');
      // @ts-expect-error - expecting message object
      expect(result.suggestion).toMatchInlineSnapshot(`
        "  Object {
            \\"dependencies\\": Object {
              \\"pkg-a\\": \\"1.0.0\\",
            },
            \\"devDependencies\\": Object {
              \\"pkg-a\\": \\"1.0.0\\",
            },
        +   \\"devDependencies\\": Object {},
          }"
      `);
    });

    it('should return a message object if there is a matching dependency and optionalDependency', async () => {
      mockFs({
        'package.json': JSON.stringify({
          dependencies: {
            'pkg-a': '1.0.0',
          },
          optionalDependencies: {
            'pkg-a': '1.0.0',
          },
        }),
      });
      const conformer = defineTestCheck(hasUniqueDependencyTypes);
      const result = await conformer.validate();

      // @ts-expect-error - expecting message object
      expect(result.message).toEqual(undefined);
      // @ts-expect-error - expecting message object
      expect(result.path).toEqual('package.json');
      // @ts-expect-error - expecting message object
      expect(result.suggestion).toMatchInlineSnapshot(`
        "  Object {
            \\"dependencies\\": Object {
              \\"pkg-a\\": \\"1.0.0\\",
            },
            \\"optionalDependencies\\": Object {
              \\"pkg-a\\": \\"1.0.0\\",
            },
        +   \\"optionalDependencies\\": Object {},
          }"
      `);
    });

    it('should return a message object if there is a matching dependency, optionalDependency, and devDependency', async () => {
      mockFs({
        'package.json': JSON.stringify({
          dependencies: {
            'pkg-a': '1.0.0',
          },
          devDependencies: {
            'pkg-a': '1.0.0',
          },
          optionalDependencies: {
            'pkg-a': '1.0.0',
          },
        }),
      });
      const conformer = defineTestCheck(hasUniqueDependencyTypes);
      const result = await conformer.validate();

      // @ts-expect-error - expecting message object
      expect(result.message).toEqual(undefined);
      // @ts-expect-error - expecting message object
      expect(result.path).toEqual('package.json');
      // @ts-expect-error - expecting message object
      expect(result.suggestion).toMatchInlineSnapshot(`
        "  Object {
            \\"dependencies\\": Object {
              \\"pkg-a\\": \\"1.0.0\\",
            },
        +   \\"dependencies\\": Object {},
            \\"devDependencies\\": Object {
              \\"pkg-a\\": \\"1.0.0\\",
            },
            \\"optionalDependencies\\": Object {
              \\"pkg-a\\": \\"1.0.0\\",
            },
          }"
      `);
    });
  });

  describe('fix', () => {
    it('should remove devDependency if also a dependency', async () => {
      mockFs({
        'package.json': JSON.stringify({
          name: 'pkg-b',
          dependencies: {
            'pkg-a': '1.0.0',
          },
          devDependencies: {
            'pkg-a': '1.0.0',
          },
        }),
      });
      const conformer = defineTestCheck(hasUniqueDependencyTypes);

      await conformer.fix();

      const packageJson = await json('./', 'package.json').get();

      expect(packageJson).toEqual({
        name: 'pkg-b',
        dependencies: {
          'pkg-a': '1.0.0',
        },
        devDependencies: {},
      });
    });

    it('should remove the optionalDependency if also a dependency', async () => {
      mockFs({
        'package.json': JSON.stringify({
          name: 'pkg-b',
          dependencies: {
            'pkg-a': '1.0.0',
          },
          optionalDependencies: {
            'pkg-a': '1.0.0',
          },
        }),
      });
      const conformer = defineTestCheck(hasUniqueDependencyTypes);

      await conformer.fix();

      const packageJson = await json('./', 'package.json').get();

      expect(packageJson).toEqual({
        name: 'pkg-b',
        dependencies: {
          'pkg-a': '1.0.0',
        },
        optionalDependencies: {},
      });
    });

    it('should remove the dependency if also a devDependency and optionalDependency', async () => {
      mockFs({
        'package.json': JSON.stringify({
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
        }),
      });

      const conformer = defineTestCheck(hasUniqueDependencyTypes);

      await conformer.fix();

      const packageJson = await json('./', 'package.json').get();

      expect(packageJson).toEqual({
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
});
