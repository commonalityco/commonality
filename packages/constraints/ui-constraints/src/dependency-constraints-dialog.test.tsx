import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { DependencyConstraintsDialog } from './dependency-constraints-dialog';
import { Dependency, ConstraintResult } from '@commonalityco/types';
import { DependencyType } from '@commonalityco/utils-core';

describe('DependencyConstraintsDialog', () => {
  it('should render without crashing', () => {
    render(<DependencyConstraintsDialog dependencies={[]} results={[]} open />);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('should display dependencies and results', () => {
    const dependencies: Dependency[] = [
      {
        source: 'pkg-a',
        target: 'pkg-b',
        version: '1.0.0',
        type: DependencyType.DEVELOPMENT,
      },
    ];
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
    ];
    render(
      <DependencyConstraintsDialog
        open
        dependencies={dependencies}
        results={results}
      />,
    );

    expect(screen.getByText('pkg-a')).toBeInTheDocument();
    expect(screen.getByText('pkg-b')).toBeInTheDocument();
    expect(screen.getByText('1.0.0')).toBeInTheDocument();
    expect(screen.getByText('development')).toBeInTheDocument();
    expect(screen.getByText('pass')).toBeInTheDocument();
  });

  it('should show onboarding when results and dependencies are empty', () => {
    render(
      <DependencyConstraintsDialog
        open
        dependencies={[
          {
            source: 'pkg-a',
            target: 'pkg-b',
            version: '1.0.0',
            type: DependencyType.DEVELOPMENT,
          },
        ]}
        results={[]}
      />,
    );

    expect(
      screen.getByText('Organize your dependency graph'),
    ).toBeInTheDocument();
  });
});
