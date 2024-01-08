import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ConstraintResults } from './constraint-results';
import { ConstraintResult } from '@commonalityco/types';
import { DependencyType } from '@commonalityco/utils-core';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

describe('ConstraintResults', () => {
  it('should render ConstraintOnboardingCard when results are empty', async () => {
    render(<ConstraintResults results={[]} />);

    const onboardingCard = screen.getByText('Organize your dependency graph');

    expect(onboardingCard).toBeInTheDocument();
  });

  it('should render results by package name', async () => {
    const results = [
      {
        dependencyPath: [
          {
            source: 'pkg-a',
            target: 'pkg-b',
            version: '1.0.0',
            type: DependencyType.DEVELOPMENT,
          },
        ],
        filter: 'filter1',
        isValid: true,
        constraint: {
          allow: ['tag-one'],
        },
      },
      {
        dependencyPath: [
          {
            source: 'pkg-c',
            target: 'pkg-d',
            version: '1.0.0',
            type: DependencyType.PRODUCTION,
          },
        ],
        constraint: {
          allow: ['tag-one'],
        },
        isValid: true,
        filter: 'filter2',
      },
    ] satisfies ConstraintResult[];

    render(<ConstraintResults results={results} />);

    const pkgATitle = screen.getByText('pkg-a');
    const pkgCTitle = screen.getByText('pkg-c');

    const packageBButton = screen.getByRole('button', { name: /pkg-b dev/i });
    const packageDButton = screen.getByRole('button', { name: /pkg-d prod/i });

    expect(pkgATitle).toBeInTheDocument();
    expect(pkgCTitle).toBeInTheDocument();

    expect(packageBButton).toBeInTheDocument();
    expect(packageDButton).toBeInTheDocument();
  });

  it('should render the full dependency path within the title', async () => {
    const results = [
      {
        dependencyPath: [
          {
            source: 'pkg-a',
            target: 'pkg-b',
            version: '1.0.0',
            type: DependencyType.PEER,
          },
          {
            source: 'pkg-b',
            target: 'pkg-c',
            version: '1.0.0',
            type: DependencyType.DEVELOPMENT,
          },
        ],
        filter: 'filter1',
        isValid: true,
        constraint: {
          allow: ['tag-one'],
        },
      },
    ];

    render(<ConstraintResults results={results} />);

    const accordionItem = screen.getByRole('button', {
      name: /pass pkg-b peer pkg-c dev/i,
    });

    expect(accordionItem).toBeInTheDocument();
  });

  it('should expand the accordion item and display the correct constraint information', async () => {
    const results = [
      {
        foundTags: ['tag-three'],
        dependencyPath: [
          {
            source: 'pkg-a',
            target: 'pkg-b',
            version: '1.0.0',
            type: DependencyType.DEVELOPMENT,
          },
        ],
        filter: 'tag-one',
        isValid: true,
        constraint: {
          allow: ['tag-one'],
          disallow: ['tag-two'],
        },
      },
    ] satisfies ConstraintResult[];

    render(<ConstraintResults results={results} />);

    const constraintButton = screen.getByRole('button', { name: /pkg-b dev/i });

    await userEvent.click(constraintButton);

    const appliedToTagsText = screen.getByLabelText('Applied to:');
    const allowedTagsText = screen.getByLabelText('Allowed:');
    const disallowedTagsText = screen.getByLabelText('Disallowed:');
    const foundTagsText = screen.getByLabelText('Found:');

    expect(appliedToTagsText.textContent).toEqual('#tag-one');
    expect(allowedTagsText.textContent).toEqual('#tag-one');
    expect(disallowedTagsText.textContent).toEqual('#tag-two');
    expect(foundTagsText.textContent).toEqual('#tag-three');
  });
});
