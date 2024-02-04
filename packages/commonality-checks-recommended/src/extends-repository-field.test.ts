import extendsRepositoryField from './extends-repository-field';
import { createTestCheck, json } from 'commonality';
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
        const conformer = createTestCheck(extendsRepositoryField, {
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

        const conformer = createTestCheck(extendsRepositoryField, {
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

        expect(result).toBe(false);
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

        const conformer = createTestCheck(extendsRepositoryField, {
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

        const conformer = createTestCheck(extendsRepositoryField, {
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

        expect(result).toBe(false);
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

        const conformer = createTestCheck(extendsRepositoryField, {
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

        expect(result).toBe(false);
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

        const conformer = createTestCheck(extendsRepositoryField, {
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

        const conformer = createTestCheck(extendsRepositoryField, {
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

        expect(result).toBe(false);
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

        const conformer = createTestCheck(extendsRepositoryField, {
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

        const conformer = createTestCheck(extendsRepositoryField, {
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

    describe('message', () => {
      it('matches the expected snapshot when repository is missing from package', async () => {
        mockFs({
          packages: {
            'pkg-a': {
              'package.json': JSON.stringify({
                name: 'foo',
              }),
            },
          },
          'package.json': JSON.stringify({
            name: 'foo',
            repository: {
              type: 'git',
              url: 'https://github.com/npm/cli.git',
            },
          }),
        });

        const conformer = createTestCheck(extendsRepositoryField, {
          workspace: {
            path: './packages/pkg-a',
            relativePath: './packages/pkg-a',
          },
          rootWorkspace: {
            path: './',
            relativePath: './',
          },
        });

        const result = await conformer.message();

        expect(result.title).toEqual(
          `Package's repository property must extend the repository property at the root of your project.`,
        );
        expect(result.filePath).toEqual('package.json');
        expect(result.suggestion).toMatchInlineSnapshot(`
          "  Object {
              \\"name\\": \\"foo\\",
          +   \\"repository\\": Object {
          +     \\"directory\\": \\"packages/pkg-a\\",
          +     \\"type\\": \\"git\\",
          +     \\"url\\": \\"https://github.com/npm/cli.git\\",
          +   },
            }"
        `);
      });

      it('matches the expected snapshot when repository exists in package', async () => {
        mockFs({
          packages: {
            'pkg-a': {
              'package.json': JSON.stringify({
                name: 'foo',
                repository: 'https://github.com/npm/cli.git/packages/pkg-a',
              }),
            },
          },
          'package.json': JSON.stringify({
            name: 'foo',
            repository: {
              type: 'git',
              url: 'https://github.com/npm/cli.git',
            },
          }),
        });

        const conformer = createTestCheck(extendsRepositoryField, {
          workspace: {
            path: './packages/pkg-a',
            relativePath: './packages/pkg-a',
          },
          rootWorkspace: {
            path: './',
            relativePath: './',
          },
        });

        const result = await conformer.message();

        expect(result.title).toEqual(
          `Package's repository property must extend the repository property at the root of your project.`,
        );
        expect(result.filePath).toEqual('package.json');
        expect(result.suggestion).toMatchInlineSnapshot(`
          "  Object {
              \\"name\\": \\"foo\\",
              \\"repository\\": \\"https://github.com/npm/cli.git/packages/pkg-a\\",
          +   \\"repository\\": Object {
          +     \\"directory\\": \\"packages/pkg-a\\",
          +     \\"type\\": \\"git\\",
          +     \\"url\\": \\"https://github.com/npm/cli.git\\",
          +   },
            }"
        `);
      });
    });
  });
});
