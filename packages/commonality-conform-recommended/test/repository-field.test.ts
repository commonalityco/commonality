import { repositoryField } from './../src/respository-field';
import { createTestConformer } from '@commonalityco/utils-file';
import { describe, it, expect, vi } from 'vitest';

describe('repository-field', () => {
  describe('validate', () => {
    it('should return true if no repository is specified', async () => {
      const conformer = createTestConformer(repositoryField(), {
        workspace: {
          path: '/root/packages/pkg-a',
          relativePath: '/packages/pkg-a',
          packageJson: {},
        },
        rootWorkspace: {
          path: '/root',
          relativePath: '.',
          packageJson: {},
        },
      });

      const result = await conformer.validate();

      expect(result).toBe(true);
    });

    it('should return false if the package does not extend the root repository field', async () => {
      const conformer = createTestConformer(repositoryField(), {
        workspace: {
          path: '/root/packages/pkg-a',
          relativePath: '/packages/pkg-a',
          packageJson: {},
        },
        rootWorkspace: {
          path: '/root',
          relativePath: '.',
          packageJson: {
            repository: 'https://github.com/npm/cli.git',
          },
        },
      });

      const result = await conformer.validate();

      expect(result).toBe(false);
    });

    it('should return true if the package does extend the root repository field', async () => {
      const conformer = createTestConformer(repositoryField(), {
        workspace: {
          path: '/root/packages/pkg-a',
          relativePath: '/packages/pkg-a',
          packageJson: {
            repository: 'https://github.com/npm/cli.git/packages/pkg-a',
          },
        },
        rootWorkspace: {
          path: '/root',
          relativePath: '.',
          packageJson: {
            repository: 'https://github.com/npm/cli.git',
          },
        },
      });

      const result = await conformer.validate();

      expect(result).toBe(true);
    });

    it('should return false if the package does not extend the root repository field when it is an object', async () => {
      const conformer = createTestConformer(repositoryField(), {
        workspace: {
          path: '/root/packages/pkg-a',
          relativePath: '/packages/pkg-a',
          packageJson: {},
        },
        rootWorkspace: {
          path: '/root',
          relativePath: '.',
          packageJson: {
            repository: {
              type: 'git',
              url: 'https://github.com/npm/cli.git',
            },
          },
        },
      });

      const result = await conformer.validate();

      expect(result).toBe(false);
    });

    it('should return true if the package does extend the root repository field when it is an object', async () => {
      const conformer = createTestConformer(repositoryField(), {
        workspace: {
          path: '/root/packages/pkg-a',
          relativePath: '/packages/pkg-a',
          packageJson: {
            repository: 'https://github.com/npm/cli.git/packages/pkg-a',
          },
        },
        rootWorkspace: {
          path: '/root',
          relativePath: '.',
          packageJson: {
            repository: { type: 'git', url: 'https://github.com/npm/cli.git' },
          },
        },
      });

      const result = await conformer.validate();

      expect(result).toBe(true);
    });
  });

  describe('fix', () => {
    it('should return the correct config when the root repository is a string and the package repository does not exist', async () => {
      const onWrite = vi.fn();
      const conformer = createTestConformer(repositoryField(), {
        onWrite,
        files: {
          'package.json': {},
        },
        workspace: {
          path: '/root/packages/pkg-a',
          relativePath: '/packages/pkg-a',
          packageJson: {},
        },
        rootWorkspace: {
          path: '/root',
          relativePath: '.',
          packageJson: {
            repository: 'https://github.com/npm/cli.git',
          },
        },
      });

      await conformer.fix();

      expect(onWrite).toBeCalledWith('package.json', {
        repository: 'https://github.com/npm/cli.git/packages/pkg-a',
      });
    });

    it('should return the correct config when the root repository is an object and the package repository does not exist', async () => {
      const onWrite = vi.fn();
      const conformer = createTestConformer(repositoryField(), {
        onWrite,
        files: {
          'package.json': {},
        },
        workspace: {
          path: '/root/packages/pkg-a',
          relativePath: '/packages/pkg-a',
          packageJson: {},
        },
        rootWorkspace: {
          path: '/root',
          relativePath: '.',
          packageJson: {
            repository: { url: 'https://github.com/npm/cli.git', type: 'git' },
          },
        },
      });

      await conformer.fix();

      expect(onWrite).toBeCalledWith('package.json', {
        repository: 'https://github.com/npm/cli.git/packages/pkg-a',
      });
    });

    it('should return the correct config when the root repository is a malformed string and the package repository is an object', async () => {
      const onWrite = vi.fn();
      const conformer = createTestConformer(repositoryField(), {
        onWrite,
        files: {
          'package.json': {
            repository: {
              url: 'https://github.com/nfewfewfwpm/cli.git',
              type: 'git',
            },
          },
        },
        workspace: {
          path: '/root/packages/pkg-a',
          relativePath: '/packages/pkg-a',
          packageJson: {
            repository: {
              url: 'https://github.com/npwefwefwefm/cli.git',
              type: 'git',
            },
          },
        },
        rootWorkspace: {
          path: '/root',
          relativePath: '.',
          packageJson: {
            repository: 'https://github.com/npm/cli.git',
          },
        },
      });

      await conformer.fix();

      expect(onWrite).toBeCalledWith('package.json', {
        repository: {
          url: 'https://github.com/npm/cli.git/packages/pkg-a',
          type: 'git',
        },
      });
    });

    it('should return the correct config when the root repository is an object and the package repository is a string', async () => {
      const onWrite = vi.fn();
      const conformer = createTestConformer(repositoryField(), {
        onWrite,
        files: {
          'package.json': {
            repository: 'https://github.com/npwefwefwefm/cli.git',
          },
        },
        workspace: {
          path: '/root/packages/pkg-a',
          relativePath: '/packages/pkg-a',
          packageJson: {
            repository: 'https://github.com/npwefwefwefm/cli.git',
          },
        },
        rootWorkspace: {
          path: '/root',
          relativePath: '.',
          packageJson: {
            repository: { url: 'https://github.com/npm/cli.git', type: 'git' },
          },
        },
      });

      await conformer.fix();

      expect(onWrite).toBeCalledWith('package.json', {
        repository: 'https://github.com/npm/cli.git/packages/pkg-a',
      });
    });

    describe('message', () => {
      it('matches the expected snapshot', async () => {
        const conformer = createTestConformer(repositoryField(), {
          workspace: {
            path: '/root/packages/pkg-a',
            relativePath: '/packages/pkg-a',
            packageJson: {
              name: 'foo',
            },
          },
          rootWorkspace: {
            path: '/root',
            relativePath: '.',
            packageJson: {
              name: 'foo',
              repository: {
                type: 'git',
                url: 'https://github.com/npm/cli.git',
              },
            },
          },
        });

        const result = await conformer.message();

        expect(result.context).toMatchInlineSnapshot(`
          "  Object {
              \\"name\\": \\"foo\\",
          +   \\"repository\\": \\"https://github.com/npm/cli.git/packages/pkg-a\\",
            }"
        `);
      });
    });
  });
});
