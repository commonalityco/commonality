import extendsRepositoryField from './extends-repository-field';
import { defineTestCheck, json } from 'commonality';
import { describe, it, expect, afterEach } from 'vitest';
import mockFs from 'mock-fs';

describe('extendsRepositoryField', () => {
  afterEach(() => {
    mockFs.restore();
  });

  describe('validate', () => {
    describe('when the root repository field is undefined', () => {
      it('should return true if no repository is specified', async () => {
        mockFs({
          'package.json': JSON.stringify({}),
          packages: {
            'pkg-a': {
              'package.json': JSON.stringify({}),
            },
          },
        });
        const conformer = defineTestCheck(extendsRepositoryField, {
          workspace: {
            path: './packages/pkg-a',
            relativePath: './packages/pkg-a',
          },
          rootWorkspace: {
            path: './',
            relativePath: './',
          },
        });

        const result = await conformer.validate();

        expect(result).toBe(true);
      });
    });

    describe('when the root repository field is a string', () => {
      const rootPackageJson = JSON.stringify({
        repository: 'https://github.com/npm/cli.git',
      });

      it('returns false when the package has no repository field', async () => {
        mockFs({
          'package.json': rootPackageJson,
          packages: {
            'pkg-a': {
              'package.json': JSON.stringify({}),
            },
          },
        });

        const conformer = defineTestCheck(extendsRepositoryField, {
          workspace: {
            path: './packages/pkg-a',
            relativePath: './packages/pkg-a',
          },
          rootWorkspace: {
            path: './',
            relativePath: './',
          },
        });

        const result = await conformer.validate();

        // @ts-expect-error expecting message object
        expect(result.message).toEqual(
          "Package's repository property must extend the repository property at the root of your project.",
        );
        // @ts-expect-error expecting message object
        expect(result.path).toEqual('package.json');
        // @ts-expect-error expecting message object
        expect(result.suggestion).toMatchInlineSnapshot(`
          "  Object {}
          + Object {
          +   \\"repository\\": Object {
          +     \\"directory\\": \\"packages/pkg-a\\",
          +     \\"type\\": \\"git\\",
          +     \\"url\\": \\"https://github.com/npm/cli.git\\",
          +   },
          + }"
        `);
      });

      it('returns true when the package has a repository field that extends the root', async () => {
        mockFs({
          'package.json': rootPackageJson,
          packages: {
            'pkg-a': {
              'package.json': JSON.stringify({
                repository: {
                  type: 'git',
                  url: 'https://github.com/npm/cli.git',
                  directory: 'packages/pkg-a',
                },
              }),
            },
          },
        });

        const conformer = defineTestCheck(extendsRepositoryField, {
          workspace: {
            path: './packages/pkg-a',
            relativePath: './packages/pkg-a',
          },
          rootWorkspace: {
            path: './',
            relativePath: './',
          },
        });

        const result = await conformer.validate();

        expect(result).toBe(true);
      });

      it('returns false when the package incorrectly extends the root repository field', async () => {
        mockFs({
          'package.json': rootPackageJson,
          packages: {
            'pkg-a': {
              'package.json': JSON.stringify({
                repository: {
                  type: 'gitt',
                  url: 'https://github.com/npm/clii.git',
                  directory: 'packages/pkg-b',
                },
              }),
            },
          },
        });

        const conformer = defineTestCheck(extendsRepositoryField, {
          workspace: {
            path: './packages/pkg-a',
            relativePath: './packages/pkg-a',
          },
          rootWorkspace: {
            path: './',
            relativePath: './',
          },
        });

        const result = await conformer.validate();

        // @ts-expect-error expecting message object
        expect(result.message).toEqual(
          "Package's repository property must extend the repository property at the root of your project.",
        );
        // @ts-expect-error expecting message object
        expect(result.path).toEqual('package.json');
        // @ts-expect-error expecting message object
        expect(result.suggestion).toMatchInlineSnapshot(`
          "  Object {
              \\"repository\\": Object {
                \\"directory\\": \\"packages/pkg-b\\",
                \\"type\\": \\"gitt\\",
                \\"url\\": \\"https://github.com/npm/clii.git\\",
          +     \\"directory\\": \\"packages/pkg-a\\",
          +     \\"type\\": \\"git\\",
          +     \\"url\\": \\"https://github.com/npm/cli.git\\",
              },
            }"
        `);
      });
    });

    describe('when the root repository field is an object', () => {
      const rootPackageJson = JSON.stringify({
        repository: { type: 'git', url: 'https://github.com/npm/cli.git' },
      });

      it('returns false when the package has no repository field', async () => {
        mockFs({
          'package.json': rootPackageJson,
          packages: {
            'pkg-a': {
              'package.json': JSON.stringify({}),
            },
          },
        });

        const conformer = defineTestCheck(extendsRepositoryField, {
          workspace: {
            path: './packages/pkg-a',
            relativePath: './packages/pkg-a',
          },
          rootWorkspace: {
            path: './',
            relativePath: './',
          },
        });

        const result = await conformer.validate();

        // @ts-expect-error expecting message object
        expect(result.message).toEqual(
          `Package's repository property must extend the repository property at the root of your project.`,
        );
        // @ts-expect-error expecting message object
        expect(result.path).toEqual(`package.json`);
        // @ts-expect-error expecting message object
        expect(result.suggestion).toMatchInlineSnapshot(`
          "  Object {}
          + Object {
          +   \\"repository\\": Object {
          +     \\"directory\\": \\"packages/pkg-a\\",
          +     \\"type\\": \\"git\\",
          +     \\"url\\": \\"https://github.com/npm/cli.git\\",
          +   },
          + }"
        `);
      });

      it('returns true when the package has a repository field that extends the root', async () => {
        mockFs({
          'package.json': rootPackageJson,
          packages: {
            'pkg-a': {
              'package.json': JSON.stringify({
                repository: {
                  type: 'git',
                  url: 'https://github.com/npm/cli.git',
                  directory: 'packages/pkg-a',
                },
              }),
            },
          },
        });

        const conformer = defineTestCheck(extendsRepositoryField, {
          workspace: {
            path: './packages/pkg-a',
            relativePath: './packages/pkg-a',
          },
          rootWorkspace: {
            path: './',
            relativePath: './',
          },
        });

        const result = await conformer.validate();

        expect(result).toBe(true);
      });

      it('returns false when the package incorrectly extends the root repository field', async () => {
        mockFs({
          'package.json': rootPackageJson,
          packages: {
            'pkg-a': {
              'package.json': JSON.stringify({
                repository: {
                  type: 'gitt',
                  url: 'https://github.com/npm/clii.git',
                  directory: 'packages/pkg-b',
                },
              }),
            },
          },
        });

        const conformer = defineTestCheck(extendsRepositoryField, {
          workspace: {
            path: './packages/pkg-a',
            relativePath: './packages/pkg-a',
          },
          rootWorkspace: {
            path: './',
            relativePath: './',
          },
        });

        const result = await conformer.validate();

        // @ts-expect-error expecting message object
        expect(result.message).toEqual(
          `Package's repository property must extend the repository property at the root of your project.`,
        );
        // @ts-expect-error expecting message object
        expect(result.path).toEqual(`package.json`);
        // @ts-expect-error expecting message object
        expect(result.suggestion).toMatchInlineSnapshot(`
          "  Object {
              \\"repository\\": Object {
                \\"directory\\": \\"packages/pkg-b\\",
                \\"type\\": \\"gitt\\",
                \\"url\\": \\"https://github.com/npm/clii.git\\",
          +     \\"directory\\": \\"packages/pkg-a\\",
          +     \\"type\\": \\"git\\",
          +     \\"url\\": \\"https://github.com/npm/cli.git\\",
              },
            }"
        `);
      });
    });
  });

  describe('fix', () => {
    describe('when the root repository field is a string', () => {
      const rootPackageJson = JSON.stringify({
        repository: 'https://github.com/npm/cli.git',
      });

      it('should return the correct config', async () => {
        mockFs({
          packages: {
            'pkg-a': {
              'package.json': JSON.stringify({}),
            },
          },
          'package.json': rootPackageJson,
        });

        const conformer = defineTestCheck(extendsRepositoryField, {
          workspace: {
            path: './packages/pkg-a',
            relativePath: './packages/pkg-a',
          },
          rootWorkspace: {
            path: './',
            relativePath: './',
          },
        });

        await conformer.fix();

        const result = await json('./', './packages/pkg-a/package.json').get();

        expect(result).toEqual({
          repository: {
            type: 'git',
            url: 'https://github.com/npm/cli.git',
            directory: 'packages/pkg-a',
          },
        });
      });
    });

    describe('when the root repository field is an object', () => {
      const rootPackageJson = JSON.stringify({
        repository: {
          type: 'git',
          url: 'https://github.com/npm/cli.git',
        },
      });

      it('should return the correct config', async () => {
        mockFs({
          packages: {
            'pkg-a': {
              'package.json': JSON.stringify({
                repository: {
                  directory: 'packages/pkg-a',
                  url: 'https://github.com/npwefwefwefm/cli.git',
                  type: 'git',
                },
              }),
            },
          },
          'package.json': rootPackageJson,
        });

        const conformer = defineTestCheck(extendsRepositoryField, {
          workspace: {
            path: './packages/pkg-a',
            relativePath: './packages/pkg-a',
          },
          rootWorkspace: {
            path: './',
            relativePath: './',
          },
        });

        await conformer.fix();

        const result = await json('./', './packages/pkg-a/package.json').get();

        expect(result).toEqual({
          repository: {
            type: 'git',
            url: 'https://github.com/npm/cli.git',
            directory: 'packages/pkg-a',
          },
        });
      });
    });
  });
});
