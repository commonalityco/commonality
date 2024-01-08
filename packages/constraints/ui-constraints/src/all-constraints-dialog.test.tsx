import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { AllConstraintsDialog } from './all-constraints-dialog';
import { ConstraintResult } from '@commonalityco/types';
import { DependencyType } from '@commonalityco/utils-core';

describe('AllConstraintsDialog', () => {
  it('renders correctly with no results', async () => {
    const results: ConstraintResult[] = [];
    const onOpenChange = vi.fn();

    render(
      <AllConstraintsDialog results={results} onOpenChange={onOpenChange} />,
    );

    expect(screen.getByText('All constraints')).toBeInTheDocument();

    expect(screen.queryByText('No packages match your filters')).toBeNull();
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

    expect(screen.getByText('All constraints')).toBeInTheDocument();
    expect(screen.getByText('1 constraints')).toBeInTheDocument();
  });
});
