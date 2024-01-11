import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import {
  ConstraintResults,
  ConstraintTitle,
  ConstraintContent,
} from './constraint-results';
import { ConstraintResult } from '@commonalityco/types';
import { DependencyType } from '@commonalityco/utils-core';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

describe('ConstraintContent', () => {
  it('should render correctly when all fields are *', () => {
    const result = {
      isValid: true,
      dependencyPath: [
        {
          source: 'pkg-a',
          target: 'pkg-b',
          version: '1.0.0',
          type: DependencyType.DEVELOPMENT,
        },
      ],
      filter: '*',
      constraint: {
        allow: '*',
        disallow: '*',
      },
      foundTags: ['*'],
    } satisfies ConstraintResult;

    render(<ConstraintContent result={result} />);

    const allowedTagsText = screen.getByLabelText('Allowed:');
    const foundTagsText = screen.getByLabelText('Found:');

    expect(allowedTagsText.textContent).toEqual('All packages');
    expect(foundTagsText.textContent).toEqual('All packages');
  });

  it('should render correctly when there are multiple tags', () => {
    const result = {
      isValid: true,
      dependencyPath: [
        {
          source: 'pkg-a',
          target: 'pkg-b',
          version: '1.0.0',
          type: DependencyType.DEVELOPMENT,
        },
      ],
      filter: 'tag-one',
      constraint: {
        allow: ['tag-one', 'tag-two'],
        disallow: ['tag-one', 'tag-two'],
      },
      foundTags: ['tag-one', 'tag-two'],
    } satisfies ConstraintResult;

    render(<ConstraintContent result={result} />);

    const allowedTagsText = screen.getByLabelText('Allowed:');
    const disallowedTagsText = screen.getByLabelText('Disallowed:');
    const foundTagsText = screen.getByLabelText('Found:');

    expect(allowedTagsText.textContent).toEqual('#tag-one#tag-two');
    expect(disallowedTagsText.textContent).toEqual('#tag-one#tag-two');
    expect(foundTagsText.textContent).toEqual('#tag-one#tag-two');
  });
});

describe('ConstraintTitle', () => {
  it('should render pass when result is valid', () => {
    const result = {
      isValid: true,
      dependencyPath: [
        {
          source: 'pkg-a',
          target: 'pkg-b',
          version: '1.0.0',
          type: DependencyType.DEVELOPMENT,
        },
      ],
      filter: 'tag-one',
      constraint: {
        allow: ['tag-one'],
      },
    } satisfies ConstraintResult;

    render(<ConstraintTitle result={result} />);

    const passText = screen.getByText('pass');

    expect(passText).toBeInTheDocument();
  });

  it('should render fail when result is not valid', () => {
    const result = {
      filter: 'tag-one',
      isValid: false,
      dependencyPath: [
        {
          source: 'pkg-a',
          target: 'pkg-b',
          version: '1.0.0',
          type: DependencyType.DEVELOPMENT,
        },
      ],
      constraint: {
        allow: ['tag-one'],
      },
    } satisfies ConstraintResult;

    render(<ConstraintTitle result={result} />);

    const failText = screen.getByText('fail');

    expect(failText).toBeInTheDocument();
  });

  it('should render dependency target and type', () => {
    const result = {
      filter: 'tag-one',
      isValid: true,
      dependencyPath: [
        {
          source: 'pkg-a',
          target: 'pkg-b',
          version: '1.0.0',
          type: DependencyType.DEVELOPMENT,
        },
      ],
      constraint: {
        allow: ['tag-one'],
      },
    } satisfies ConstraintResult;

    render(<ConstraintTitle result={result} />);

    const targetText = screen.getByText('pkg-b');
    const typeText = screen.getByText('dev');

    expect(targetText).toBeInTheDocument();
    expect(typeText).toBeInTheDocument();
  });

  it('should render multiple dependencies in the dependencies path', () => {
    const result = {
      filter: 'tag-one',
      isValid: true,
      dependencyPath: [
        {
          source: 'pkg-a',
          target: 'pkg-b',
          version: '1.0.0',
          type: DependencyType.DEVELOPMENT,
        },
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
    } satisfies ConstraintResult;

    render(<ConstraintTitle result={result} />);

    const targetText1 = screen.getByText('pkg-b');
    const typeText1 = screen.getByText('dev');
    const targetText2 = screen.getByText('pkg-d');
    const typeText2 = screen.getByText('prod');

    expect(targetText1).toBeInTheDocument();
    expect(typeText1).toBeInTheDocument();
    expect(targetText2).toBeInTheDocument();
    expect(typeText2).toBeInTheDocument();
  });
});

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

    const allowedTagsText = screen.getByLabelText('Allowed:');
    const disallowedTagsText = screen.getByLabelText('Disallowed:');
    const foundTagsText = screen.getByLabelText('Found:');

    expect(allowedTagsText.textContent).toEqual('#tag-one');
    expect(disallowedTagsText.textContent).toEqual('#tag-two');
    expect(foundTagsText.textContent).toEqual('#tag-three');
  });
});
