import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { AllConstraintsDialog } from './all-constraints-dialog';
import { ConstraintResult } from '@commonalityco/types';
import { DependencyType } from '@commonalityco/utils-core';

describe('AllConstraintsDialog', () => {
  it('filters out package names that do not match the search term', async () => {
    const results: ConstraintResult[] = [
      {
        dependencyPath: [
          {
            source: 'pkg-a',
            target: 'pkg-b',
            version: '1.0.0',
            type: DependencyType.DEVELOPMENT,
          },
        ],
        constraint: { allow: ['tag-one'] },
        isValid: true,
        filter: 'tag-one',
      },
      {
        dependencyPath: [
          {
            source: 'pkg-c',
            target: 'pkg-d',
            version: '1.0.0',
            type: DependencyType.DEVELOPMENT,
          },
        ],
        constraint: { allow: ['tag-two'] },
        isValid: true,
        filter: 'tag-two',
      },
    ];
    const onOpenChange = vi.fn();

    render(
      <AllConstraintsDialog results={results} onOpenChange={onOpenChange} />,
    );

    await userEvent.click(
      screen.getByRole('button', { name: 'View all constraints' }),
    );

    await userEvent.type(screen.getByLabelText('Search packages'), 'pkg-a');

    expect(screen.getByText('1 constraints')).toBeInTheDocument();
    expect(screen.queryByText('pkg-c')).not.toBeInTheDocument();
  });

  it('shows no packages match your filters if the search does not match any packages', async () => {
    const results: ConstraintResult[] = [
      {
        dependencyPath: [
          {
            source: 'test',
            target: 'test',
            version: '1.0.0',
            type: DependencyType.DEVELOPMENT,
          },
        ],
        constraint: { allow: ['tag-one'] },
        isValid: true,
        filter: 'tag-one',
      },
    ];
    const onOpenChange = vi.fn();

    render(
      <AllConstraintsDialog results={results} onOpenChange={onOpenChange} />,
    );

    await userEvent.click(
      screen.getByRole('button', { name: 'View all constraints' }),
    );

    await userEvent.type(
      screen.getByLabelText('Search packages'),
      'nonexistent',
    );

    expect(
      screen.getByText('No packages match your filters'),
    ).toBeInTheDocument();
  });

  it('renders correctly with no results', async () => {
    const results: ConstraintResult[] = [];
    const onOpenChange = vi.fn();

    render(
      <AllConstraintsDialog results={results} onOpenChange={onOpenChange} />,
    );

    await userEvent.click(
      screen.getByRole('button', { name: 'View all constraints' }),
    );

    expect(
      screen.queryByPlaceholderText('Search packages'),
    ).not.toBeInTheDocument();
  });

  it('renders correctly with results', async () => {
    const results: ConstraintResult[] = [
      {
        dependencyPath: [
          {
            source: 'test',
            target: 'test',
            version: '1.0.0',
            type: DependencyType.DEVELOPMENT,
          },
        ],
        constraint: { allow: ['tag-one'] },
        isValid: true,
        filter: 'tag-one',
      },
    ];
    const onOpenChange = vi.fn();

    render(
      <AllConstraintsDialog results={results} onOpenChange={onOpenChange} />,
    );

    await userEvent.click(
      screen.getByRole('button', { name: 'View all constraints' }),
    );

    expect(screen.getByText('All constraints')).toBeInTheDocument();
    expect(screen.getByText('1 constraints')).toBeInTheDocument();
  });
});
