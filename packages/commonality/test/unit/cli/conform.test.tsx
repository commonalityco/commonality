import { beforeEach, describe, expect, it, test, vi } from 'vitest';
import { action as conform } from '../../../src/cli/commands/conform.js';
import process from 'node:process';
import console from 'node:console';
import { ConformanceResult } from '@commonalityco/types';
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

const mockError = new Error('this-is-an-error');
mockError.stack = 'mock-stack';

const getConsoleCalls = () => {
  return vi
    .mocked(console.log)
    .mock.calls.map((call) => call.map((item) => stripAnsi(item)));
};

describe('conform', () => {
  beforeEach(() => {
    vi.mocked(process.exit).mockReset();
    vi.mocked(console.log).mockReset();
  });

  describe('when there is an error getting results', () => {
    it('should exit the process with status code 1', async () => {
      await conform({
        verbose: false,
        getResults: async () => {
          throw mockError;
        },
        onFix: vi.fn(),
      });

      expect(process.exit).toHaveBeenCalledWith(1);
    });

    it('output should match snapshot', async () => {
      await conform({
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
      await conform({
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
        ✓ pkg-one (1)
        ✓ pkg-two (1)

        Packages: 0 failed 0 warnings 2 passed (2)
          Checks: 0 failed 0 warnings 2 passed (2)",
          ],
        ]
      `);
    });

    test('when verbose is true it should match the snapshot', async () => {
      await conform({
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
                filepath: 'package.json',
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
        # * (1)
        ✓ pass This package should be cool
        │      /path/package.json
        ❯ pkg-two (1)
        # * (1)
        ✓ pass This package should be cool

        Packages: 0 failed 0 warnings 2 passed (2)
          Checks: 0 failed 0 warnings 2 passed (2)",
          ],
        ]
      `);
    });
  });

  describe('when checks fail', () => {
    test('when verbose is false it should match the snapshot', async () => {
      await conform({
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
        # * (1)
        ⚠ warn This package should be cool

        Packages: 0 failed 1 warnings 1 passed (2)
          Checks: 0 failed 1 warnings 1 passed (2)",
          ],
        ]
      `);
    });

    test('when verbose is true it should match the snapshot', async () => {
      await conform({
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
        ❯ pkg-one (1)
        # * (1)
        ✓ pass This package should be awesome
        ❯ pkg-two (1)
        # * (1)
        ⚠ warn This package should be cool

        Packages: 0 failed 1 warnings 1 passed (2)
          Checks: 0 failed 1 warnings 1 passed (2)",
          ],
        ]
      `);
    });

    test('when user does not choose to run fixes', async () => {
      prompts.inject([false]);

      await conform({
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
        # * (1)
        ⚠ warn This package should be cool

        Packages: 0 failed 1 warnings 1 passed (2)
          Checks: 0 failed 1 warnings 1 passed (2)",
          ],
        ]
      `);
    });

    test('when user chooses to run fixes and it is successful', async () => {
      prompts.inject([true]);

      await conform({
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
        # * (1)
        ⚠ warn This package should be cool

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

    test('when user chooses to run fixes and it throws', async () => {
      prompts.inject([true]);

      await conform({
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
        # * (1)
        ⚠ warn This package should be cool

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
  });
});
