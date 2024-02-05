import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { AllChecksDialog } from './all-checks-dialog';
import { ConformanceResult } from '@commonalityco/utils-conformance';
import { PackageType, Status } from '@commonalityco/utils-core';

describe('AllChecksDialog', () => {
  it('renders correctly with no results', async () => {
    const results: ConformanceResult[] = [];
    const onOpenChange = vi.fn();

    render(<AllChecksDialog results={results} onOpenChange={onOpenChange} />);

    await userEvent.click(
      screen.getByRole('button', { name: 'View all checks' }),
    );

    expect(
      screen.queryByPlaceholderText('Search packages'),
    ).not.toBeInTheDocument();
  });

  it('renders correctly with results', async () => {
    const results: ConformanceResult[] = [
      {
        name: 'my-check',
        status: Status.Pass,
        package: {
          name: 'test',
          version: '1.0.0',
          type: PackageType.NODE,
          path: '/packages/pkg-a',
        },
        filter: 'tag-one',
        message: {
          message: 'Test message',
        },
      },
    ];
    const onOpenChange = vi.fn();

    render(<AllChecksDialog results={results} onOpenChange={onOpenChange} />);

    await userEvent.click(
      screen.getByRole('button', { name: 'View all checks' }),
    );

    expect(screen.getByText('All checks')).toBeInTheDocument();
    expect(screen.getByText('1 checks')).toBeInTheDocument();
  });

  it('filters out package names that do not match the search term', async () => {
    const results: ConformanceResult[] = [
      {
        name: 'my-check-one',
        status: Status.Pass,
        package: {
          name: 'pkg-a',
          version: '1.0.0',
          type: PackageType.NODE,
          path: '/packages/pkg-a',
        },
        filter: 'tag-one',
        message: {
          message: 'Test message',
        },
      },
      {
        name: 'my-check-two',
        status: Status.Pass,
        package: {
          name: 'pkg-b',
          version: '1.0.0',
          type: PackageType.NODE,
          path: '/packages/pkg-b',
        },
        filter: 'tag-two',

        message: {
          message: 'Test message',
        },
      },
    ];
    const onOpenChange = vi.fn();

    render(<AllChecksDialog results={results} onOpenChange={onOpenChange} />);

    await userEvent.click(
      screen.getByRole('button', { name: 'View all checks' }),
    );

    await userEvent.type(screen.getByLabelText('Search packages'), 'pkg-a');

    expect(screen.getByText('1 checks')).toBeInTheDocument();
    expect(screen.queryByText('pkg-b')).not.toBeInTheDocument();
  });

  it('shows no packages match your filters if the search does not match any packages', async () => {
    const results: ConformanceResult[] = [
      {
        name: 'my-check',
        status: Status.Pass,
        package: {
          name: 'pkg-a',
          version: '1.0.0',
          type: PackageType.NODE,
          path: '/packages/pkg-a',
        },
        filter: 'tag-one',
        message: {
          message: 'Test message',
        },
      },
    ];
    const onOpenChange = vi.fn();

    render(<AllChecksDialog results={results} onOpenChange={onOpenChange} />);

    await userEvent.click(
      screen.getByRole('button', { name: 'View all checks' }),
    );

    await userEvent.type(
      screen.getByLabelText('Search packages'),
      'nonexistent',
    );

    expect(
      screen.getByText('No packages match your filters'),
    ).toBeInTheDocument();
  });
});
