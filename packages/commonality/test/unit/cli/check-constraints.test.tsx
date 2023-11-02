import React from 'react';
import { render, cleanup } from 'ink-testing-library';
import { afterEach, describe, expect, it } from 'vitest';
import { CheckConstraints } from '../../../src/cli/components/check-constraints.js';
import { useAsyncFn } from '../../../src/cli/utils/use-async-fn.js';
import { vi } from 'vitest';
import * as ink from 'ink';
import { ProjectConfig } from '@commonalityco/types';

vi.mock('../../../src/cli/utils/use-async-fn.js', () => {
  return { useAsyncFn: vi.fn() };
});

vi.mock('ink', async () => {
  return {
    ...(await vi.importActual<typeof ink>('ink')),
    useApp: vi.fn().mockReturnValue({}),
  };
});

describe('CheckConstraints', () => {
  afterEach(() => {
    cleanup();
  });

  it('should render loading message when loading', () => {
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
      <CheckConstraints>{() => <div key="hello" />}</CheckConstraints>,
    );
    expect(lastFrame()).toContain('Loading...');
  });

  it('should render no project configuration found when there is no valid data', () => {
    vi.mocked(useAsyncFn).mockReturnValue({
      status: 'success',
      data: { isEmpty: true },
      error: undefined,
      isLoading: false,
      isSuccess: true,
      isError: false,
      refetch: () => Promise.resolve(),
    });
    const { lastFrame } = render(
      <CheckConstraints>{() => <div />}</CheckConstraints>,
    );
    expect(lastFrame()).toContain('No project configuration found');
  });

  it('should render no checks found when there are no constraints', () => {
    vi.mocked(useAsyncFn).mockReturnValue({
      status: 'success',
      data: { config: { constraints: {} } satisfies ProjectConfig },
      error: undefined,
      isLoading: false,
      isSuccess: true,
      isError: false,
      refetch: () => Promise.resolve(),
    });
    const { lastFrame } = render(
      <CheckConstraints>{() => <div />}</CheckConstraints>,
    );
    expect(lastFrame()).toContain('No checks found');
  });

  it('should render children when there are constraints', () => {
    vi.mocked(useAsyncFn).mockReturnValue({
      status: 'success',
      data: {
        config: {
          constraints: { '*': { allow: ['tag-one'] } },
        } satisfies ProjectConfig,
      },
      error: undefined,
      isLoading: false,
      isSuccess: true,
      isError: false,
      refetch: () => Promise.resolve(),
    });
    const { lastFrame } = render(
      <CheckConstraints>
        {() => <ink.Text>Test Constraint</ink.Text>}
      </CheckConstraints>,
    );
    const result = lastFrame();

    expect(result).toContain('Test Constraint');
  });

  it('should call exit when there is an error', () => {
    const exitMock = vi.fn();
    vi.mocked(ink.useApp).mockReturnValue({ exit: exitMock });
    vi.mocked(useAsyncFn).mockReturnValue({
      status: 'error',
      data: undefined,
      error: new Error('Test Error'),
      isLoading: false,
      isSuccess: false,
      isError: true,
      refetch: () => Promise.resolve(),
    });
    render(<CheckConstraints>{() => <div />}</CheckConstraints>);
    expect(exitMock).toHaveBeenCalledWith(new Error('Test Error'));
  });
});
