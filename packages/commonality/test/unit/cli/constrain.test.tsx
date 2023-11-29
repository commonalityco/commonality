import React from 'react';
import { render, cleanup } from 'ink-testing-library';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ConstraintValidator } from '../../../src/cli/commands/constrain/constrain.js';
import { useAsyncFn } from '../../../src/cli/utils/use-async-fn.js';
import { DependencyType, PackageType } from '@commonalityco/utils-core';
import stripAnsi from 'strip-ansi';
import { Violation } from '@commonalityco/types';
import * as ink from 'ink';
import * as dataViolations from '@commonalityco/data-violations';

vi.mock('../../../src/cli/utils/use-async-fn.js', () => {
  return { useAsyncFn: vi.fn().mockReturnValue({}) };
});

vi.mock('@commonalityco/data-violations', async () => ({
  ...(await vi.importActual<typeof dataViolations>(
    '@commonalityco/data-violations',
  )),
  getViolations: vi.fn(),
}));

vi.mock('ink', async () => ({
  ...(await vi.importActual<typeof ink>('ink')),
}));

describe('constrain', () => {
  beforeEach(() => {
    cleanup();
  });

  describe('when encountering an error', () => {
    it('exits the app with the error', () => {
      const mockError = new Error('Hello');
      const mockExit = vi.fn();

      vi.mocked(useAsyncFn).mockReturnValue({
        status: 'error',
        data: undefined,
        error: mockError,
        isLoading: false,
        isSuccess: false,
        isError: true,
        refetch: () => Promise.resolve(),
      });

      vi.spyOn(ink, 'useApp').mockReturnValue({ exit: mockExit });

      const { lastFrame } = render(
        <ConstraintValidator
          constraints={{}}
          packages={[]}
          tagsData={[]}
          dependencies={[]}
          verbose={false}
        />,
      );
      const result = lastFrame() ?? '';

      expect(result).toBe('');
      expect(mockExit).toHaveBeenCalled();
    });
  });

  describe('when loading', () => {
    it('renders the loading spinner', () => {
      vi.mocked(useAsyncFn).mockReturnValue({
        status: 'loading',
        data: undefined,
        error: undefined,
        isLoading: true,
        isSuccess: false,
        isError: false,
        refetch: () => Promise.resolve(),
      });

      const { lastFrame } = render(
        <ConstraintValidator
          constraints={{}}
          packages={[]}
          tagsData={[]}
          dependencies={[]}
          verbose={false}
        />,
      );
      const result = stripAnsi(lastFrame() ?? '');

      expect(result).toMatchInlineSnapshot('"⠋ Validating constraints..."');
    });
  });

  describe('when there are no constrained dependencies', () => {
    const renderComponent = ({ verbose }: { verbose: boolean }) =>
      render(
        <ConstraintValidator
          constraints={{
            'tag-one': { allow: '*' },
            'tag-two': { allow: ['tag-one'] },
          }}
          packages={[
            {
              name: 'pkg-one',
              version: '1.0.0',
              type: PackageType.NODE,
              path: '/path',
            },
            {
              name: 'pkg-two',
              version: '1.0.0',
              type: PackageType.NODE,
              path: '/path',
            },
            {
              name: 'pkg-three',
              version: '1.0.0',
              type: PackageType.NODE,
              path: '/path',
            },
          ]}
          tagsData={[{ packageName: 'pkg-one', tags: ['tag-one'] }]}
          dependencies={[]}
          verbose={verbose}
        />,
      );

    describe('and verbose is false', () => {
      it('matches the snapshot', () => {
        vi.mocked(useAsyncFn).mockReturnValue({
          status: 'success',
          data: [],
          error: undefined,
          isLoading: false,
          isSuccess: true,
          isError: false,
          refetch: () => Promise.resolve(),
        });

        const { lastFrame } = renderComponent({ verbose: false });
        const result = stripAnsi(lastFrame() ?? '');

        expect(result).toMatchInlineSnapshot(`
          "✓ pkg-one (0)
          ✓ pkg-two (0)
          ✓ pkg-three (0)

          Packages:    0 failed 3 passed (3)
          Constraints: 0 failed 2 passed (2)"
        `);
      });
    });

    describe('and verbose is true', () => {
      it('matches the snapshot', () => {
        vi.mocked(useAsyncFn).mockReturnValue({
          status: 'success',
          data: [],
          error: undefined,
          isLoading: false,
          isSuccess: true,
          isError: false,
          refetch: () => Promise.resolve(),
        });

        const { lastFrame } = renderComponent({ verbose: true });
        const result = stripAnsi(lastFrame() ?? '');

        expect(result).toMatchInlineSnapshot(`
          "✓ pkg-one (0)
          │  No internal dependencies
          │
          ✓ pkg-two (0)
          │  No internal dependencies
          │
          ✓ pkg-three (0)
          │  No internal dependencies
          │

          Packages:    0 failed 3 passed (3)
          Constraints: 0 failed 2 passed (2)"
        `);
      });
    });
  });

  describe('when all tests pass', () => {
    const renderComponent = ({ verbose }: { verbose: boolean }) =>
      render(
        <ConstraintValidator
          constraints={{
            'tag-one': { allow: '*' },
            'tag-two': { allow: ['tag-one'] },
          }}
          packages={[
            {
              name: 'pkg-one',
              version: '1.0.0',
              type: PackageType.NODE,
              path: '/path',
            },
            {
              name: 'pkg-two',
              version: '1.0.0',
              type: PackageType.NODE,
              path: '/path',
            },
            {
              name: 'pkg-three',
              version: '1.0.0',
              type: PackageType.NODE,
              path: '/path',
            },
          ]}
          tagsData={[{ packageName: 'pkg-one', tags: ['tag-one'] }]}
          dependencies={[
            {
              source: 'pkg-one',
              target: 'pkg-two',
              version: '1.0.0',
              type: DependencyType.DEVELOPMENT,
            },
            {
              source: 'pkg-two',
              target: 'pkg-three',
              version: '1.0.0',
              type: DependencyType.DEVELOPMENT,
            },
          ]}
          verbose={verbose}
        />,
      );

    describe('and verbose is false', () => {
      it('matches the snapshot', () => {
        vi.mocked(useAsyncFn).mockReturnValue({
          status: 'success',
          data: [],
          error: undefined,
          isLoading: false,
          isSuccess: true,
          isError: false,
          refetch: () => Promise.resolve(),
        });

        const { lastFrame } = renderComponent({ verbose: false });
        const result = stripAnsi(lastFrame() ?? '');

        expect(result).toMatchInlineSnapshot(`
          "✓ pkg-one (1)
          ✓ pkg-two (0)
          ✓ pkg-three (0)

          Packages:    0 failed 3 passed (3)
          Constraints: 0 failed 2 passed (2)"
        `);
      });
    });

    describe('and verbose is true', () => {
      it('matches the snapshot', () => {
        vi.mocked(useAsyncFn).mockReturnValue({
          status: 'success',
          data: [],
          error: undefined,
          isLoading: false,
          isSuccess: true,
          isError: false,
          refetch: () => Promise.resolve(),
        });

        const { lastFrame } = renderComponent({ verbose: true });
        const result = stripAnsi(lastFrame() ?? '');

        expect(result).toMatchInlineSnapshot(`
          "❯ pkg-one (1)
          ↳ pass #tag-one → pkg-two development
          │      Allowed: All packages
          │
          ✓ pkg-two (0)
          │  No constraints for internal dependencies
          │
          ✓ pkg-three (0)
          │  No internal dependencies
          │

          Packages:    0 failed 3 passed (3)
          Constraints: 0 failed 2 passed (2)"
        `);
      });
    });
  });

  describe('when tests fail', () => {
    const renderComponent = ({ verbose }: { verbose: boolean }) =>
      render(
        <ConstraintValidator
          constraints={{
            'tag-one': { disallow: ['tag-three'] },
            'tag-two': { disallow: ['tag-five'] },
          }}
          packages={[
            {
              name: 'pkg-one',
              version: '1.0.0',
              type: PackageType.NODE,
              path: '/path',
            },
            {
              name: 'pkg-two',
              version: '1.0.0',
              type: PackageType.NODE,
              path: '/path',
            },
            {
              name: 'pkg-three',
              version: '1.0.0',
              type: PackageType.NODE,
              path: '/path',
            },
          ]}
          tagsData={[
            { packageName: 'pkg-one', tags: ['tag-one', 'tag-two'] },
            { packageName: 'pkg-two', tags: ['tag-three'] },
            { packageName: 'pkg-three', tags: ['tag-four'] },
          ]}
          dependencies={[
            {
              source: 'pkg-one',
              target: 'pkg-two',
              type: DependencyType.DEVELOPMENT,
              version: '1.0.0',
            },
            {
              source: 'pkg-one',
              target: 'pkg-three',
              type: DependencyType.DEVELOPMENT,
              version: '1.0.0',
            },
          ]}
          verbose={verbose}
        />,
      );

    beforeEach(() => {
      vi.mocked(useAsyncFn).mockReturnValue({
        status: 'success',
        data: [
          {
            sourcePackageName: 'pkg-one',
            targetPackageName: 'pkg-three',
            appliedTo: 'tag-one',
            allowed: [],
            disallowed: ['tag-three'],
          },
        ] satisfies Violation[],
        error: undefined,
        isLoading: false,
        isSuccess: true,
        isError: false,
        refetch: () => Promise.resolve(),
      });
    });

    describe('and verbose is false', () => {
      it('matches the snapshot', () => {
        const { lastFrame } = renderComponent({ verbose: false });

        const result = stripAnsi(lastFrame() ?? '');
        cleanup();
        expect(result).toMatchInlineSnapshot(`
          "❯ pkg-one (4)
          │ /path/commonality.json
          │
          ↳ fail #tag-one → pkg-three development
          │      Disallowed: #tag-three
          │
          ✓ pkg-two (0)
          ✓ pkg-three (0)

          Packages:    1 failed 2 passed (3)
          Constraints: 1 failed 1 passed (2)"
        `);
      });
    });

    describe('and verbose is true', () => {
      it('matches the snapshot', () => {
        const { lastFrame } = renderComponent({ verbose: true });

        const result = stripAnsi(lastFrame() ?? '');
        cleanup();
        expect(result).toMatchInlineSnapshot(`
          "❯ pkg-one (4)
          │ /path/commonality.json
          │
          ↳ fail #tag-one → pkg-three development
          │      Disallowed: #tag-three
          │
          ↳ pass #tag-one → pkg-two development
          │      Disallowed: #tag-three
          │
          ↳ fail #tag-two → pkg-three development
          │      Disallowed: #tag-five
          │
          ↳ pass #tag-two → pkg-two development
          │      Disallowed: #tag-five
          │
          ✓ pkg-two (0)
          │  No internal dependencies
          │
          ✓ pkg-three (0)
          │  No internal dependencies
          │

          Packages:    1 failed 2 passed (3)
          Constraints: 1 failed 1 passed (2)"
        `);
      });
    });
  });

  describe('when there are no constraints', () => {
    beforeEach(() => {
      vi.mocked(useAsyncFn).mockReturnValue({
        status: 'success',
        data: [],
        error: undefined,
        isLoading: false,
        isSuccess: true,
        isError: false,
        refetch: () => Promise.resolve(),
      });
    });

    const renderComponent = ({ verbose }: { verbose: boolean }) =>
      render(
        <ConstraintValidator
          constraints={{}}
          packages={[
            {
              name: 'pkg-one',
              version: '1.0.0',
              type: PackageType.NODE,
              path: '/path',
            },
            {
              name: 'pkg-two',
              version: '1.0.0',
              type: PackageType.NODE,
              path: '/path',
            },
            {
              name: 'pkg-three',
              version: '1.0.0',
              type: PackageType.NODE,
              path: '/path',
            },
          ]}
          tagsData={[
            { packageName: 'pkg-one', tags: ['tag-one'] },
            { packageName: 'pkg-two', tags: ['tag-two'] },
            { packageName: 'pkg-three', tags: ['tag-three'] },
          ]}
          dependencies={[
            {
              source: 'pkg-one',
              target: 'pkg-two',
              type: DependencyType.DEVELOPMENT,
              version: '1.0.0',
            },
          ]}
          verbose={verbose}
        />,
      );

    describe('and verbose is false', () => {
      it('should match the snapshot', () => {
        const { lastFrame } = renderComponent({ verbose: false });
        const result = stripAnsi(lastFrame() ?? '');

        expect(result).toMatchInlineSnapshot(`
          "✓ pkg-one (0)
          ✓ pkg-two (0)
          ✓ pkg-three (0)

          Packages:    0 failed 3 passed (3)
          Constraints: 0 failed 0 passed (0)"
        `);
      });
    });

    describe('and verbose is true', () => {
      it('should match the snapshot', () => {
        const { lastFrame } = renderComponent({ verbose: true });
        const result = stripAnsi(lastFrame() ?? '');

        expect(result).toMatchInlineSnapshot(`
          "✓ pkg-one (0)
          │  No constraints for internal dependencies
          │
          ✓ pkg-two (0)
          │  No internal dependencies
          │
          ✓ pkg-three (0)
          │  No internal dependencies
          │

          Packages:    0 failed 3 passed (3)
          Constraints: 0 failed 0 passed (0)"
        `);
      });
    });
  });

  describe('when there are no dependencies for a package', () => {
    beforeEach(() => {
      vi.mocked(useAsyncFn).mockReturnValue({
        status: 'success',
        data: [],
        error: undefined,
        isLoading: false,
        isSuccess: true,
        isError: false,
        refetch: () => Promise.resolve(),
      });
    });

    const renderComponent = ({ verbose }: { verbose: boolean }) =>
      render(
        <ConstraintValidator
          constraints={{
            'tag-one': { disallow: ['tag-three'] },
            'tag-two': { disallow: ['tag-five'] },
          }}
          packages={[
            {
              name: 'pkg-one',
              version: '1.0.0',
              type: PackageType.NODE,
              path: '/path',
            },
            {
              name: 'pkg-two',
              version: '1.0.0',
              type: PackageType.NODE,
              path: '/path',
            },
            {
              name: 'pkg-three',
              version: '1.0.0',
              type: PackageType.NODE,
              path: '/path',
            },
          ]}
          tagsData={[
            { packageName: 'pkg-one', tags: ['tag-one', 'tag-two'] },
            { packageName: 'pkg-two', tags: ['tag-three'] },
            { packageName: 'pkg-three', tags: ['tag-four'] },
          ]}
          dependencies={[]}
          verbose={verbose}
        />,
      );

    describe('and verbose is false', () => {
      it('matches the snapshot', () => {
        const { lastFrame } = renderComponent({ verbose: false });
        const result = stripAnsi(lastFrame() ?? '');

        expect(result).toMatchInlineSnapshot(`
          "✓ pkg-one (0)
          ✓ pkg-two (0)
          ✓ pkg-three (0)

          Packages:    0 failed 3 passed (3)
          Constraints: 0 failed 2 passed (2)"
        `);
      });
    });

    describe('and verbose is true', () => {
      it('matches the snapshot', () => {
        const { lastFrame } = renderComponent({ verbose: true });
        const result = stripAnsi(lastFrame() ?? '');

        expect(result).toMatchInlineSnapshot(`
          "✓ pkg-one (0)
          │  No internal dependencies
          │
          ✓ pkg-two (0)
          │  No internal dependencies
          │
          ✓ pkg-three (0)
          │  No internal dependencies
          │

          Packages:    0 failed 3 passed (3)
          Constraints: 0 failed 2 passed (2)"
        `);
      });
    });
  });
});
