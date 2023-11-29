import React from 'react';
import { render } from 'ink-testing-library';
import { describe, expect, it, vi } from 'vitest';
import { ConformRunner } from '../../../src/cli/commands/conform.js';
import stripAnsi from 'strip-ansi';
import { useAsyncFn } from '../../../src/cli/utils/use-async-fn.js';
import { ConformanceResult } from '@commonalityco/types';
import { getConformanceResults } from '@commonalityco/feature-conformance';
import * as ink from 'ink';
import { PackageType } from '@commonalityco/utils-core';

vi.mock('../../../src/cli/utils/use-async-fn.js', async () => {
  return {
    ...(await vi.importActual<typeof useAsyncFn>(
      '../../../src/cli/utils/use-async-fn.js',
    )),
  };
});

vi.mock('ink', async () => ({
  ...(await vi.importActual<typeof ink>('ink')),
  useInput: vi.fn(),
}));

vi.mock('@commonalityco/feature-conformance', async () => ({
  runFixes: vi.fn(),
}));

vi.mock('@commonalityco/feature-conformance', async () => ({
  getConformanceResults: vi.fn(),
}));

type WaitForOptions = {
  interval?: number;
  timeout?: number;
};

async function waitFor(
  predicate: () => boolean | Promise<boolean>,
  { interval = 50, timeout = 5000 }: WaitForOptions = {},
): Promise<void> {
  const start = Date.now();

  const check = async () => {
    if (await predicate()) {
      return;
    }
    if (Date.now() - start > timeout) {
      throw new Error('waitFor timed out');
    }
    await new Promise((resolve) => setTimeout(resolve, interval));
    await check();
  };

  await check();
}

describe('when results are loading', () => {
  it('should match the snapshot', () => {
    vi.mocked(getConformanceResults).mockResolvedValue([]);

    const { lastFrame } = render(
      <ConformRunner
        verbose={false}
        conformersByPattern={{ '*': [] }}
        rootDirectory={'/root'}
        tagsData={[]}
        codeownersData={[]}
        packages={[]}
      />,
    );

    const result = stripAnsi(lastFrame() ?? '');

    expect(result).toMatchInlineSnapshot('"⠋ Running checks..."');
  });
});

describe('when there is an error loading results', () => {
  it('should call the onError callback', async () => {
    const onError = vi.fn();
    const mockError = new Error('hello');

    vi.mocked(getConformanceResults).mockRejectedValue(mockError);

    const { lastFrame } = render(
      <ConformRunner
        codeownersData={[]}
        packages={[]}
        verbose={false}
        conformersByPattern={{ '*': [] }}
        rootDirectory={'/root'}
        tagsData={[]}
        onError={onError}
      />,
    );

    await waitFor(() => {
      return lastFrame() === '';
    });

    expect(onError).toHaveBeenCalledWith(mockError);
  });
});

describe('when all checks pass', () => {
  describe('and verbose is false', () => {
    it('should match the snapshot', async () => {
      vi.mocked(getConformanceResults).mockResolvedValue([
        {
          name: 'CONFORMER_NAME/ONE',
          pattern: '*',
          level: 'warning',
          isValid: true,
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
          pattern: '*',
          level: 'warning',
          isValid: true,
          package: {
            path: '/path',
            name: 'pkg-two',
            version: '1.0.0',
            type: PackageType.NODE,
          },
          message: { title: 'This package should be cool' },
        },
      ] satisfies ConformanceResult[]);

      const { lastFrame } = render(
        <ConformRunner
          codeownersData={[]}
          packages={[]}
          verbose={false}
          conformersByPattern={{ '*': [] }}
          rootDirectory={'/root'}
          tagsData={[]}
        />,
      );

      await waitFor(() => {
        const result = stripAnsi(lastFrame() ?? '');

        return !result.includes('Running checks...');
      });

      const result = stripAnsi(lastFrame() ?? '');

      expect(result).toMatchInlineSnapshot(`
        "
        ✓ pkg-one (1)
        ✓ pkg-two (1)

        Packages: 0 failed 2 passed (2)
          Checks: 0 failed 2 passed (2)"
      `);
    });
  });

  describe('and verbose is true', () => {
    it('should match the snapshot', async () => {
      vi.mocked(getConformanceResults).mockResolvedValue([
        {
          name: 'CONFORMER_NAME/ONE',
          pattern: '*',
          level: 'warning',
          isValid: true,
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
          pattern: '*',
          level: 'warning',
          isValid: true,
          package: {
            path: '/path',
            name: 'pkg-two',
            version: '1.0.0',
            type: PackageType.NODE,
          },
          message: { title: 'This package should be cool' },
        },
      ] satisfies ConformanceResult[]);

      const { lastFrame } = render(
        <ConformRunner
          codeownersData={[]}
          packages={[]}
          verbose={true}
          conformersByPattern={{ '*': [] }}
          rootDirectory={'/root'}
          tagsData={[]}
        />,
      );

      await waitFor(() => {
        const result = stripAnsi(lastFrame() ?? '');

        return !result.includes('Running checks...');
      });

      const result = stripAnsi(lastFrame() ?? '');

      expect(result).toMatchInlineSnapshot(`
        "
        ❯ pkg-one (1)
          ✓ pass This package should be cool
        ❯ pkg-two (1)
          ✓ pass This package should be cool

        Packages: 0 failed 2 passed (2)
          Checks: 0 failed 2 passed (2)"
      `);
    });
  });
});

describe('when checks fail', () => {
  it('should match the snapshot when verbose is false', async () => {
    vi.mocked(getConformanceResults).mockResolvedValue([
      {
        name: 'CONFORMER_NAME/ONE',
        pattern: '*',
        level: 'warning',
        isValid: true,
        package: {
          path: '/path',
          name: 'pkg-one',
          version: '1.0.0',
          type: PackageType.NODE,
        },
        message: { title: 'This package is bad' },
      },
      {
        name: 'CONFORMER_NAME/TWO',
        pattern: '*',
        level: 'warning',
        isValid: false,
        package: {
          path: '/path',
          name: 'pkg-two',
          version: '1.0.0',
          type: PackageType.NODE,
        },
        message: { title: 'This package should be cool' },
      },
    ] satisfies ConformanceResult[]);

    const { lastFrame } = render(
      <ConformRunner
        codeownersData={[]}
        packages={[]}
        verbose={false}
        conformersByPattern={{ '*': [] }}
        rootDirectory={'/root'}
        tagsData={[]}
      />,
    );

    await waitFor(() => {
      const result = stripAnsi(lastFrame() ?? '');

      return !result.includes('Running checks...');
    });

    const result = stripAnsi(lastFrame() ?? '');

    expect(result).toMatchInlineSnapshot(`
      "
      ✓ pkg-one (1)
      ❯ pkg-two (1)
        ✘ fail This package should be cool

      Packages: 1 failed 1 passed (2)
        Checks: 1 failed 1 passed (2)"
    `);
  });

  it('should match the snapshot when verbose is true', async () => {
    vi.mocked(getConformanceResults).mockResolvedValue([
      {
        name: 'CONFORMER_NAME/ONE',
        pattern: '*',
        level: 'warning',
        isValid: true,
        package: {
          path: '/path',
          name: 'pkg-one',
          version: '1.0.0',
          type: PackageType.NODE,
        },
        message: { title: 'This package is bad' },
      },
      {
        name: 'CONFORMER_NAME/TWO',
        pattern: '*',
        level: 'warning',
        isValid: false,
        package: {
          path: '/path',
          name: 'pkg-two',
          version: '1.0.0',
          type: PackageType.NODE,
        },
        message: { title: 'This package should be cool' },
      },
    ] satisfies ConformanceResult[]);

    const { lastFrame } = render(
      <ConformRunner
        codeownersData={[]}
        packages={[]}
        verbose={true}
        conformersByPattern={{ '*': [] }}
        rootDirectory={'/root'}
        tagsData={[]}
      />,
    );

    await waitFor(() => {
      const result = stripAnsi(lastFrame() ?? '');

      return !result.includes('Running checks...');
    });

    const result = stripAnsi(lastFrame() ?? '');

    expect(result).toMatchInlineSnapshot(`
      "
      ❯ pkg-one (1)
        ✓ pass This package is bad
      ❯ pkg-two (1)
        ✘ fail This package should be cool

      Packages: 1 failed 1 passed (2)
        Checks: 1 failed 1 passed (2)"
    `);
  });
});

describe('when checks fail with fixable issues', () => {
  it('should match the snapshot', async () => {
    vi.mocked(getConformanceResults).mockResolvedValue([
      {
        name: 'CONFORMER_NAME/ONE',
        pattern: '*',
        level: 'warning',
        isValid: true,
        package: {
          path: '/path',
          name: 'pkg-one',
          version: '1.0.0',
          type: PackageType.NODE,
        },
        message: { title: 'This package is bad' },
        fix: () => {},
      },
      {
        name: 'CONFORMER_NAME/TWO',
        pattern: '*',
        level: 'warning',
        isValid: false,
        package: {
          path: '/path',
          name: 'pkg-two',
          version: '1.0.0',
          type: PackageType.NODE,
        },
        message: { title: 'This package should be cool' },
        fix: () => {},
      },
    ] satisfies ConformanceResult[]);

    const { lastFrame, stdout } = render(
      <ConformRunner
        codeownersData={[]}
        packages={[]}
        verbose={false}
        conformersByPattern={{ '*': [] }}
        rootDirectory={'/root'}
        tagsData={[]}
      />,
    );

    await waitFor(() => {
      const result = stripAnsi(stdout.lastFrame() ?? '');

      return !result.includes('Running checks...');
    });

    const result = stripAnsi(lastFrame() ?? '');

    expect(result).toMatchInlineSnapshot(`
      "
      ✓ pkg-one (1)
      ❯ pkg-two (1)
        ✘ fail This package should be cool

      Packages: 1 failed 1 passed (2)
        Checks: 1 failed 1 passed (2)

      Found 1 fixable issues, run fix functions?
      press y or enter to run conformers
      press n or esc to exit"
    `);
  });
});
