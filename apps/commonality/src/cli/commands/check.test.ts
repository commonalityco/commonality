import { beforeEach, describe, expect, it, test, vi } from 'vitest';
import { action as check } from './check.js';
import { ConformanceResult } from '@commonalityco/utils-conformance';
import process from 'node:process';
import console from 'node:console';
import { PackageType, Status } from '@commonalityco/utils-core';
import stripAnsi from 'strip-ansi';
import prompts from 'prompts';

vi.mock('node:process', async () => ({
  default: {
    ...(await vi.importActual<NodeJS.Process>('node:process')),
    exit: vi.fn(),
  },
}));

vi.mock('node:console', async () => ({
  default: {
    ...(await vi.importActual<Console>('node:console')),
    log: vi.fn().mockImplementation(() => {}),
  },
}));

vi.mock('std-env', () => {
  return {
    isCI: false,
  };
});

const mockError = new Error('this-is-an-error');
mockError.stack = 'mock-stack';

const getConsoleCalls = () => {
  return vi
    .mocked(console.log)
    .mock.calls.map((call) =>
      call.map((item) => (typeof item === 'string' ? stripAnsi(item) : item)),
    );
};

describe('check', () => {
  beforeEach(() => {
    vi.mocked(process.exit).mockReset();
    vi.mocked(console.log).mockReset();
  });

  describe('when there are no results', () => {
    it('should show an empty state message', async () => {
      await check({
        verbose: false,
        getResults: async () => [],
        onFix: vi.fn(),
      });

      expect(console.log).toHaveBeenCalledTimes(1);

      expect(getConsoleCalls()).toMatchInlineSnapshot(`
        [
          [
            "
        You don't have any checks configured.

        Create powerful conformance rules that run like tests and can be shared like lint rules.

        https://commonality.co/docs/checks",
          ],
        ]
      `);
    });

    it('output should match snapshot', async () => {
      await check({
        verbose: false,
        getResults: async () => {
          throw mockError;
        },
        onFix: vi.fn(),
      });

      expect(console.log).toHaveBeenCalledTimes(1);

      expect(getConsoleCalls()).toMatchInlineSnapshot(`
        [
          [
            "
         Error:  this-is-an-error
        mock-stack",
          ],
        ]
      `);
    });
  });

  describe('when there is an error getting results', () => {
    it('should exit the process with status code 1', async () => {
      await check({
        verbose: false,
        getResults: async () => {
          throw mockError;
        },
        onFix: vi.fn(),
      });

      expect(process.exit).toHaveBeenCalledWith(1);
    });

    it('output should match snapshot', async () => {
      await check({
        verbose: false,
        getResults: async () => {
          throw mockError;
        },
        onFix: vi.fn(),
      });

      expect(console.log).toHaveBeenCalledTimes(1);

      expect(getConsoleCalls()).toMatchInlineSnapshot(`
        [
          [
            "
         Error:  this-is-an-error
        mock-stack",
          ],
        ]
      `);
    });
  });

  describe('when all checks pass', () => {
    test('when verbose is false it should match the snapshot', async () => {
      await check({
        verbose: false,
        getResults: async () => {
          return [
            {
              name: 'CONFORMER_NAME/ONE',
              filter: '*',
              status: Status.Pass,
              package: {
                path: '/path',
                name: 'pkg-one',
                version: '1.0.0',
                type: PackageType.NODE,
              },
              message: { title: 'This package should be cool' },
            },
            {
              name: 'CONFORMER_NAME/TWO',
              filter: '*',
              status: Status.Pass,
              package: {
                path: '/path',
                name: 'pkg-one',
                version: '1.0.0',
                type: PackageType.NODE,
              },
              message: { title: 'This package should be cool' },
            },
          ] satisfies ConformanceResult[];
        },
        onFix: vi.fn(),
      });

      expect(getConsoleCalls()).toMatchInlineSnapshot(`
        [
          [
            "
        ✓ pkg-one (2)

        Packages: 0 failed 0 warnings 1 passed (1)
          Checks: 0 failed 0 warnings 2 passed (2)",
          ],
        ]
      `);
    });

    test('when verbose is true it should match the snapshot', async () => {
      await check({
        verbose: true,
        getResults: async () => {
          return [
            {
              name: 'CONFORMER_NAME/ONE',
              filter: '*',
              status: Status.Pass,
              package: {
                path: '/path',
                name: 'pkg-one',
                version: '1.0.0',
                type: PackageType.NODE,
              },
              message: {
                title: 'This package should be cool',
                filePath: 'package.json',
              },
            },
            {
              name: 'CONFORMER_NAME/TWO',
              filter: '*',
              status: Status.Pass,
              package: {
                path: '/path',
                name: 'pkg-two',
                version: '1.0.0',
                type: PackageType.NODE,
              },
              message: { title: 'This package should be cool' },
            },
          ] satisfies ConformanceResult[];
        },
        onFix: vi.fn(),
      });

      expect(getConsoleCalls()).toMatchInlineSnapshot(`
        [
          [
            "
        ❯ pkg-one (1)
        ✓ pass This package should be cool
        │      /path/package.json
        │      
        ❯ pkg-two (1)
        ✓ pass This package should be cool
        │      

        Packages: 0 failed 0 warnings 2 passed (2)
          Checks: 0 failed 0 warnings 2 passed (2)",
          ],
        ]
      `);
    });
  });

  describe('when checks fail', () => {
    it('should not call process.exit when there are only warnings', async () => {
      await check({
        verbose: false,
        getResults: async () => {
          return [
            {
              name: 'CONFORMER_NAME/ONE',
              filter: '*',
              status: Status.Pass,
              package: {
                path: '/path',
                name: 'pkg-one',
                version: '1.0.0',
                type: PackageType.NODE,
              },
              message: { title: 'This package should be awesome' },
            },
            {
              name: 'CONFORMER_NAME/TWO',
              filter: '*',
              status: Status.Warn,
              package: {
                path: '/path',
                name: 'pkg-two',
                version: '1.0.0',
                type: PackageType.NODE,
              },
              message: { title: 'This package should be cool' },
            },
          ];
        },
        onFix: vi.fn(),
      });

      expect(process.exit).not.toHaveBeenCalled();
    });

    it('should exit the process with status code 1 when there are failures', async () => {
      await check({
        verbose: false,
        getResults: async () => {
          return [
            {
              name: 'CONFORMER_NAME/ONE',
              filter: '*',
              status: Status.Pass,
              package: {
                path: '/path',
                name: 'pkg-one',
                version: '1.0.0',
                type: PackageType.NODE,
              },
              message: { title: 'This package should be awesome' },
            },
            {
              name: 'CONFORMER_NAME/TWO',
              filter: '*',
              status: Status.Fail,
              package: {
                path: '/path',
                name: 'pkg-two',
                version: '1.0.0',
                type: PackageType.NODE,
              },
              message: { title: 'This package should be cool' },
            },
          ];
        },
        onFix: vi.fn(),
      });

      expect(process.exit).toHaveBeenCalledWith(1);
    });

    test('when verbose is false it should match the snapshot', async () => {
      await check({
        verbose: false,
        getResults: async () => {
          return [
            {
              name: 'CONFORMER_NAME/ONE',
              filter: '*',
              status: Status.Pass,
              package: {
                path: '/path',
                name: 'pkg-one',
                version: '1.0.0',
                type: PackageType.NODE,
              },
              message: { title: 'This package should be awesome' },
            },
            {
              name: 'CONFORMER_NAME/TWO',
              filter: '*',
              status: Status.Warn,
              package: {
                path: '/path',
                name: 'pkg-two',
                version: '1.0.0',
                type: PackageType.NODE,
              },
              message: { title: 'This package should be cool' },
            },
          ];
        },
        onFix: vi.fn(),
      });

      expect(getConsoleCalls()).toMatchInlineSnapshot(`
        [
          [
            "
        ✓ pkg-one (1)
        ❯ pkg-two (1)
        ⚠ warn This package should be cool
        │      

        Packages: 0 failed 1 warnings 1 passed (2)
          Checks: 0 failed 1 warnings 1 passed (2)",
          ],
        ]
      `);
    });

    test('when verbose is true it should match the snapshot', async () => {
      await check({
        verbose: true,
        getResults: async () => {
          return [
            {
              name: 'CONFORMER_NAME/ONE',
              filter: '*',
              status: Status.Pass,
              package: {
                path: '/path',
                name: 'pkg-one',
                version: '1.0.0',
                type: PackageType.NODE,
              },
              message: {
                title: 'This package should be awesome',
                filePath: 'package.json',
                suggestion: `I\nam\na\nmultiline\nstring`,
              },
            },
            {
              name: 'CONFORMER_NAME/TWO',
              filter: '*',
              status: Status.Warn,
              package: {
                path: '/path',
                name: 'pkg-two',
                version: '1.0.0',
                type: PackageType.NODE,
              },
              message: { title: 'This package should be cool' },
            },
          ];
        },
        onFix: vi.fn(),
      });

      expect(getConsoleCalls()).toMatchInlineSnapshot(`
        [
          [
            "
        ❯ pkg-one (1)
        ✓ pass This package should be awesome
        │      /path/package.json
        │      I
        │      am
        │      a
        │      multiline
        │      string
        │      
        ❯ pkg-two (1)
        ⚠ warn This package should be cool
        │      

        Packages: 0 failed 1 warnings 1 passed (2)
          Checks: 0 failed 1 warnings 1 passed (2)",
          ],
        ]
      `);
    });

    test('when there are fixes and the user does not choose to run them', async () => {
      prompts.inject([false]);

      await check({
        verbose: false,
        getResults: vi
          .fn()
          .mockResolvedValueOnce([
            {
              name: 'CONFORMER_NAME/ONE',
              filter: '*',
              status: Status.Pass,
              package: {
                path: '/path',
                name: 'pkg-one',
                version: '1.0.0',
                type: PackageType.NODE,
              },
              message: { title: 'This package should be awesome' },
              fix: () => {},
            },
            {
              name: 'CONFORMER_NAME/TWO',
              filter: '*',
              status: Status.Warn,
              package: {
                path: '/path',
                name: 'pkg-two',
                version: '1.0.0',
                type: PackageType.NODE,
              },
              message: { title: 'This package should be cool' },
              fix: () => {},
            },
          ])
          .mockResolvedValueOnce([
            {
              name: 'CONFORMER_NAME/ONE',
              filter: '*',
              status: Status.Pass,
              package: {
                path: '/path',
                name: 'pkg-one',
                version: '1.0.0',
                type: PackageType.NODE,
              },
              message: { title: 'This package should be awesome' },
              fix: () => {},
            },
            {
              name: 'CONFORMER_NAME/TWO',
              filter: '*',
              status: Status.Pass,
              package: {
                path: '/path',
                name: 'pkg-two',
                version: '1.0.0',
                type: PackageType.NODE,
              },
              message: { title: 'This package should be cool' },
              fix: () => {},
            },
          ]),
        onFix: vi.fn(),
      });

      expect(getConsoleCalls()).toMatchInlineSnapshot(`
        [
          [
            "
        ✓ pkg-one (1)
        ❯ pkg-two (1)
        ⚠ warn This package should be cool
        │      

        Packages: 0 failed 1 warnings 1 passed (2)
          Checks: 0 failed 1 warnings 1 passed (2)",
          ],
        ]
      `);
    });

    test('when there are fixes and the command is run in CI', async () => {
      vi.doMock('std-env', () => {
        return {
          isCI: true,
        };
      });

      await check({
        verbose: false,
        getResults: vi
          .fn()
          .mockResolvedValueOnce([
            {
              name: 'CONFORMER_NAME/ONE',
              filter: '*',
              status: Status.Pass,
              package: {
                path: '/path',
                name: 'pkg-one',
                version: '1.0.0',
                type: PackageType.NODE,
              },
              message: { title: 'This package should be awesome' },
              fix: () => {},
            },
            {
              name: 'CONFORMER_NAME/TWO',
              filter: '*',
              status: Status.Warn,
              package: {
                path: '/path',
                name: 'pkg-two',
                version: '1.0.0',
                type: PackageType.NODE,
              },
              message: { title: 'This package should be cool' },
              fix: () => {},
            },
          ])
          .mockResolvedValueOnce([
            {
              name: 'CONFORMER_NAME/ONE',
              filter: '*',
              status: Status.Pass,
              package: {
                path: '/path',
                name: 'pkg-one',
                version: '1.0.0',
                type: PackageType.NODE,
              },
              message: { title: 'This package should be awesome' },
              fix: () => {},
            },
            {
              name: 'CONFORMER_NAME/TWO',
              filter: '*',
              status: Status.Pass,
              package: {
                path: '/path',
                name: 'pkg-two',
                version: '1.0.0',
                type: PackageType.NODE,
              },
              message: { title: 'This package should be cool' },
              fix: () => {},
            },
          ]),
        onFix: vi.fn(),
      });

      expect(getConsoleCalls()).toMatchInlineSnapshot(`
        [
          [
            "
        ✓ pkg-one (1)
        ❯ pkg-two (1)
        ⚠ warn This package should be cool
        │      

        Packages: 0 failed 1 warnings 1 passed (2)
          Checks: 0 failed 1 warnings 1 passed (2)",
          ],
        ]
      `);
    });

    test('when there are fixes and the user chooses to run them and it is successful', async () => {
      prompts.inject([true]);

      await check({
        verbose: false,
        getResults: vi
          .fn()
          .mockResolvedValueOnce([
            {
              name: 'CONFORMER_NAME/ONE',
              filter: '*',
              status: Status.Pass,
              package: {
                path: '/path',
                name: 'pkg-one',
                version: '1.0.0',
                type: PackageType.NODE,
              },
              message: { title: 'This package should be awesome' },
              fix: () => {},
            },
            {
              name: 'CONFORMER_NAME/TWO',
              filter: '*',
              status: Status.Warn,
              package: {
                path: '/path',
                name: 'pkg-two',
                version: '1.0.0',
                type: PackageType.NODE,
              },
              message: { title: 'This package should be cool' },
              fix: () => {},
            },
          ])
          .mockResolvedValueOnce([
            {
              name: 'CONFORMER_NAME/ONE',
              filter: '*',
              status: Status.Pass,
              package: {
                path: '/path',
                name: 'pkg-one',
                version: '1.0.0',
                type: PackageType.NODE,
              },
              message: { title: 'This package should be awesome' },
              fix: () => {},
            },
            {
              name: 'CONFORMER_NAME/TWO',
              filter: '*',
              status: Status.Pass,
              package: {
                path: '/path',
                name: 'pkg-two',
                version: '1.0.0',
                type: PackageType.NODE,
              },
              message: { title: 'This package should be cool' },
              fix: () => {},
            },
          ]),
        onFix: vi.fn(),
      });

      expect(getConsoleCalls()).toMatchInlineSnapshot(`
        [
          [
            "
        ✓ pkg-one (1)
        ❯ pkg-two (1)
        ⚠ warn This package should be cool
        │      

        Packages: 0 failed 1 warnings 1 passed (2)
          Checks: 0 failed 1 warnings 1 passed (2)",
          ],
          [
            "",
          ],
          [
            "
        ✓ pkg-one (1)
        ✓ pkg-two (1)

        Packages: 0 failed 0 warnings 2 passed (2)
          Checks: 0 failed 0 warnings 2 passed (2)",
          ],
        ]
      `);
    });

    test('when user chooses to run fixes and it throws it should match the snapshot', async () => {
      prompts.inject([true]);

      await check({
        verbose: false,
        getResults: vi.fn().mockResolvedValueOnce([
          {
            name: 'CONFORMER_NAME/ONE',
            filter: '*',
            status: Status.Pass,
            package: {
              path: '/path',
              name: 'pkg-one',
              version: '1.0.0',
              type: PackageType.NODE,
            },
            message: { title: 'This package should be awesome' },
            fix: () => {},
          },
          {
            name: 'CONFORMER_NAME/TWO',
            filter: '*',
            status: Status.Warn,
            package: {
              path: '/path',
              name: 'pkg-two',
              version: '1.0.0',
              type: PackageType.NODE,
            },
            message: { title: 'This package should be cool' },
            fix: () => {},
          },
        ]),
        onFix: vi.fn().mockRejectedValue(mockError),
      });

      expect(getConsoleCalls()).toMatchInlineSnapshot(`
        [
          [
            "
        ✓ pkg-one (1)
        ❯ pkg-two (1)
        ⚠ warn This package should be cool
        │      

        Packages: 0 failed 1 warnings 1 passed (2)
          Checks: 0 failed 1 warnings 1 passed (2)",
          ],
          [
            "",
          ],
          [
            "
         Error:  this-is-an-error
        mock-stack",
          ],
        ]
      `);
    });

    test('when user chooses to run fixes and it throws it should exit with status code 1', async () => {
      prompts.inject([true]);

      await check({
        verbose: false,
        getResults: vi.fn().mockResolvedValueOnce([
          {
            name: 'CONFORMER_NAME/ONE',
            filter: '*',
            status: Status.Pass,
            package: {
              path: '/path',
              name: 'pkg-one',
              version: '1.0.0',
              type: PackageType.NODE,
            },
            message: { title: 'This package should be awesome' },
            fix: () => {},
          },
          {
            name: 'CONFORMER_NAME/TWO',
            filter: '*',
            status: Status.Warn,
            package: {
              path: '/path',
              name: 'pkg-two',
              version: '1.0.0',
              type: PackageType.NODE,
            },
            message: { title: 'This package should be cool' },
            fix: () => {},
          },
        ]),
        onFix: vi.fn().mockRejectedValue(mockError),
      });

      expect(process.exit).toHaveBeenCalledTimes(1);
      expect(process.exit).toHaveBeenCalledWith(1);
    });
  });
});
