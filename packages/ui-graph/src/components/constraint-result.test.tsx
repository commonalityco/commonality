import React from 'react';
import { render, screen } from '@testing-library/react';
import { ConstraintResult, TagDetails } from './constraint-result.js';
import { describe, test, expect } from 'vitest';

describe('<TagDetails />', () => {
  test('renders the given label', () => {
    render(<TagDetails label="Test Label" helpText="Test Help" />);

    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  test('shows "All packages" when appliedTo is a wildcard', () => {
    render(
      <TagDetails label="Test Label" helpText="Test Help" appliedTo="*" />,
    );
    expect(screen.getByText('All packages')).toBeInTheDocument();
  });

  test('shows "No tags found" when appliedTo is an empty array', () => {
    render(
      <TagDetails label="Test Label" helpText="Test Help" appliedTo={[]} />,
    );
    expect(screen.getByText('No tags found')).toBeInTheDocument();
  });

  test('lists all tags when appliedTo has some tags', () => {
    const tags = ['tag1', 'tag2'];
    render(
      <TagDetails label="Test Label" helpText="Test Help" appliedTo={tags} />,
    );
    for (const tag of tags) {
      expect(screen.getByText(`#${tag}`)).toBeInTheDocument();
    }
  });
});

describe('<ConstraintResult />', () => {
  test('renders "Allowed" section when allow property is in constraint', () => {
    render(
      <ConstraintResult constraint={{ applyTo: 'foo', allow: ['tagA'] }} />,
    );
    expect(screen.getByText('Allowed')).toBeInTheDocument();
    expect(screen.queryByText('Disallowed')).not.toBeInTheDocument();
    expect(screen.queryByText('Found')).not.toBeInTheDocument();
  });

  test('renders "Disallowed" section when disallow property is in constraint', () => {
    render(
      <ConstraintResult constraint={{ applyTo: 'foo', disallow: ['tagB'] }} />,
    );
    expect(screen.getByText('Disallowed')).toBeInTheDocument();
  });

  test('renders "Found" section when violation prop is provided', () => {
    render(
      <ConstraintResult
        constraint={{
          applyTo: 'foo',
          allow: ['tagA'],
          disallow: ['tagB'],
        }}
        violation={{
          sourcePackageName: 'pkg-one',
          targetPackageName: 'pkg-two',
          appliedTo: 'tag-one',
          allowed: ['tag-two'],
          disallowed: ['tag-three'],
          found: ['tagC'],
        }}
      />,
    );
    expect(screen.getByText('Found')).toBeInTheDocument();
  });
});
