import stripAnsi from 'strip-ansi';
import { multipleDependencyTypes } from './../src/multiple-dependency-types';
import { describe, it, expect, vi } from 'vitest';
import { createTestConformer } from '@commonalityco/utils-file';

describe('multipleDependencyTypes', () => {
  describe('validate', () => {
    it('should return true if no dependencies are specified in multiple dependency types', async () => {
      const conformer = createTestConformer(multipleDependencyTypes(), {
        files: {
          'package.json': {
            dependencies: {
              'pkg-a': '1.0.0',
            },
          },
        },
      });

      const result = await conformer.validate();

      expect(result).toBe(true);
    });

    it('should return false if there is a matching dependency and devDependency', async () => {
      const conformer = createTestConformer(multipleDependencyTypes(), {
        files: {
          'package.json': {
            dependencies: {
              'pkg-a': '1.0.0',
            },
            devDependencies: {
              'pkg-a': '1.0.0',
            },
          },
        },
      });

      const result = await conformer.validate();

      expect(result).toBe(false);
    });

    it('should return false if there is a matching dependency and optionalDependency', async () => {
      const conformer = createTestConformer(multipleDependencyTypes(), {
        files: {
          'package.json': {
            dependencies: {
              'pkg-a': '1.0.0',
            },
            optionalDependencies: {
              'pkg-a': '1.0.0',
            },
          },
        },
      });

      const result = await conformer.validate();

      expect(result).toBe(false);
    });

    it('should return false if there is a matching dependency, optionalDependency, and devDependency', async () => {
      const conformer = createTestConformer(multipleDependencyTypes(), {
        files: {
          'package.json': {
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
        },
      });

      const result = await conformer.validate();

      expect(result).toBe(false);
    });
  });

  describe('fix', () => {
    it('should remove devDependency if also a dependency', async () => {
      const onWrite = vi.fn();
      const conformer = createTestConformer(multipleDependencyTypes(), {
        onWrite,
        files: {
          'package.json': {
            name: 'pkg-b',
            dependencies: {
              'pkg-a': '1.0.0',
            },
            devDependencies: {
              'pkg-a': '1.0.0',
            },
          },
        },
      });

      await conformer.fix();

      expect(onWrite).toHaveBeenCalledWith('package.json', {
        name: 'pkg-b',
        dependencies: {
          'pkg-a': '1.0.0',
        },
        devDependencies: {},
      });
    });

    it('should remove the optionalDependency if also a dependency', async () => {
      const onWrite = vi.fn();
      const conformer = createTestConformer(multipleDependencyTypes(), {
        onWrite,
        files: {
          'package.json': {
            name: 'pkg-b',
            dependencies: {
              'pkg-a': '1.0.0',
            },
            optionalDependencies: {
              'pkg-a': '1.0.0',
            },
          },
        },
      });

      await conformer.fix();

      expect(onWrite).toHaveBeenCalledWith('package.json', {
        name: 'pkg-b',
        dependencies: {
          'pkg-a': '1.0.0',
        },
        optionalDependencies: {},
      });
    });

    it('should remove the dependency if also a devDependency and optionalDependency', async () => {
      const onWrite = vi.fn();
      const conformer = createTestConformer(multipleDependencyTypes(), {
        onWrite,
        files: {
          'package.json': {
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
        },
      });

      await conformer.fix();

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
    it('should output the correct message', async () => {
      const onWrite = vi.fn();
      const conformer = createTestConformer(multipleDependencyTypes(), {
        onWrite,
        files: {
          'package.json': {
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
        },
      });

      const message = await conformer.message();

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
