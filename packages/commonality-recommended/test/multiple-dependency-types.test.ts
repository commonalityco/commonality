import { multipleDependencyTypes } from './../src/multiple-dependency-types';
import { describe, it, expect, afterEach } from 'vitest';
import { createTestConformer, json } from 'commonality';
import mockFs from 'mock-fs';

describe('multipleDependencyTypes', () => {
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
      const conformer = createTestConformer(multipleDependencyTypes());

      const result = await conformer.validate();

      expect(result).toBe(true);
    });

    it('should return false if there is a matching dependency and devDependency', async () => {
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

      const conformer = createTestConformer(multipleDependencyTypes());
      const result = await conformer.validate();

      expect(result).toBe(false);
    });

    it('should return false if there is a matching dependency and optionalDependency', async () => {
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
      const conformer = createTestConformer(multipleDependencyTypes());
      const result = await conformer.validate();

      expect(result).toBe(false);
    });

    it('should return false if there is a matching dependency, optionalDependency, and devDependency', async () => {
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
      const conformer = createTestConformer(multipleDependencyTypes());
      const result = await conformer.validate();

      expect(result).toBe(false);
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
      const conformer = createTestConformer(multipleDependencyTypes());

      await conformer.fix();

      const packageJson = await json('package.json').get();

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
      const conformer = createTestConformer(multipleDependencyTypes());

      await conformer.fix();

      const packageJson = await json('package.json').get();

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

      const conformer = createTestConformer(multipleDependencyTypes());

      await conformer.fix();

      const packageJson = await json('package.json').get();

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

  describe('message', () => {
    it('should output the correct message', async () => {
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

      const conformer = createTestConformer(multipleDependencyTypes());
      const message = await conformer.message();

      expect(message.title).toEqual(
        'A dependency should only be in one of dependencies, devDependencies, or optionalDependencies',
      );

      expect(message.context ?? '').toMatchInlineSnapshot(
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
