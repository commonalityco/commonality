import { DependencyType } from '@commonalityco/utils-core';
import { getConstraintResults } from './get-constraint-results';
import { describe, expect, test } from 'vitest';

describe('get-constraint-results', () => {
  test('when there are no constraints it returns an empty array', async () => {
    const results = await getConstraintResults({
      dependencies: [
        {
          source: 'pkg-a',
          target: 'pkg-b',
          version: '1.0.0',
          type: DependencyType.PRODUCTION,
        },
      ],
      constraints: {},
      tagsData: [{ packageName: 'pkg-a', tags: ['tag-a'] }],
    });

    expect(results).toEqual([]);
  });

  test('when the allow constraint matches no dependencies it returns no results', async () => {
    const results = await getConstraintResults({
      dependencies: [
        {
          source: 'pkg-a',
          target: 'pkg-b',
          version: '1.0.0',
          type: DependencyType.PRODUCTION,
        },
      ],
      constraints: { 'tag-one': { allow: ['tag-two'] } },
      tagsData: [],
    });

    expect(results).toEqual([]);
  });

  test('when the allow constraint matches all dependencies but none have tags it returns no results', async () => {
    const results = await getConstraintResults({
      dependencies: [
        {
          source: 'pkg-a',
          target: 'pkg-b',
          version: '1.0.0',
          type: DependencyType.PRODUCTION,
        },
      ],
      constraints: {
        'tag-one': { allow: '*' },
      },
      tagsData: [
        { packageName: 'pkg-a', tags: [] },
        { packageName: 'pkg-b', tags: [] },
      ],
    });

    expect(results).toEqual([]);
  });

  test('when the allow constraint matches all dependencies it returns valid results', async () => {
    const results = await getConstraintResults({
      dependencies: [
        {
          source: 'pkg-a',
          target: 'pkg-b',
          version: '1.0.0',
          type: DependencyType.PRODUCTION,
        },
      ],
      constraints: {
        'tag-one': { allow: '*' },
        restricted: { allow: ['restricted'] },
      },
      tagsData: [
        { packageName: 'pkg-a', tags: ['tag-one'] },
        { packageName: 'pkg-b', tags: [] },
      ],
    });

    expect(results).toEqual([
      {
        filter: 'tag-one',
        constraint: {
          allow: '*',
        },
        dependencyPath: [
          {
            source: 'pkg-a',
            target: 'pkg-b',
            type: 'production',
            version: '1.0.0',
          },
        ],
        foundTags: [],
        isValid: true,
      },
    ]);
  });

  test('when the allow constraint allows matches a dependency with no tags it returns invalid results', async () => {
    const results = await getConstraintResults({
      dependencies: [
        {
          source: 'pkg-a',
          target: 'pkg-b',
          version: '1.0.0',
          type: DependencyType.PRODUCTION,
        },
      ],
      constraints: {
        'tag-one': { allow: ['tag-two'] },
      },
      tagsData: [
        { packageName: 'pkg-a', tags: ['tag-one'] },
        { packageName: 'pkg-b', tags: [] },
      ],
    });

    expect(results).toEqual([
      {
        filter: 'tag-one',
        constraint: {
          allow: ['tag-two'],
        },
        dependencyPath: [
          {
            source: 'pkg-a',
            target: 'pkg-b',
            type: 'production',
            version: '1.0.0',
          },
        ],
        foundTags: [],
        isValid: false,
      },
    ]);
  });

  test('when the allow constraint does not match the dependency tags it returns invalid results', async () => {
    const results = await getConstraintResults({
      dependencies: [
        {
          source: 'pkg-a',
          target: 'pkg-b',
          version: '1.0.0',
          type: DependencyType.PRODUCTION,
        },
      ],
      constraints: {
        'tag-one': { allow: ['tag-two'] },
      },
      tagsData: [
        { packageName: 'pkg-a', tags: ['tag-one'] },
        { packageName: 'pkg-b', tags: ['tag-three'] },
      ],
    });

    expect(results).toEqual([
      {
        filter: 'tag-one',
        constraint: {
          allow: ['tag-two'],
        },
        dependencyPath: [
          {
            source: 'pkg-a',
            target: 'pkg-b',
            type: 'production',
            version: '1.0.0',
          },
        ],
        foundTags: ['tag-three'],
        isValid: false,
      },
    ]);
  });

  test('when an allow constraint matches the dependency tags it returns valid results', async () => {
    const results = await getConstraintResults({
      dependencies: [
        {
          source: 'pkg-a',
          target: 'pkg-b',
          version: '1.0.0',
          type: DependencyType.PRODUCTION,
        },
      ],
      constraints: {
        'tag-one': { allow: ['tag-two'] },
      },
      tagsData: [
        { packageName: 'pkg-a', tags: ['tag-one'] },
        { packageName: 'pkg-b', tags: ['tag-two'] },
      ],
    });

    expect(results).toEqual([
      {
        filter: 'tag-one',
        constraint: {
          allow: ['tag-two'],
        },
        dependencyPath: [
          {
            source: 'pkg-a',
            target: 'pkg-b',
            type: 'production',
            version: '1.0.0',
          },
        ],
        foundTags: ['tag-two'],
        isValid: true,
      },
    ]);
  });

  test('when there are multiple matching allow constraints and a dependency has no tags it returns multiple invalid results', async () => {
    const results = await getConstraintResults({
      dependencies: [
        {
          source: 'pkg-a',
          target: 'pkg-b',
          version: '1.0.0',
          type: DependencyType.PRODUCTION,
        },
      ],
      constraints: {
        'tag-one': { allow: ['tag-two'] },
        'tag-five': { allow: ['tag-six'] },
        'tag-two': { allow: ['tag-two'] },
      },
      tagsData: [
        { packageName: 'pkg-a', tags: ['tag-one', 'tag-five'] },
        { packageName: 'pkg-b', tags: [] },
      ],
    });

    expect(results).toEqual([
      {
        constraint: {
          allow: ['tag-two'],
        },
        filter: 'tag-one',
        dependencyPath: [
          {
            source: 'pkg-a',
            target: 'pkg-b',
            type: 'production',
            version: '1.0.0',
          },
        ],
        foundTags: [],
        isValid: false,
      },
      {
        filter: 'tag-five',
        constraint: {
          allow: ['tag-six'],
        },
        dependencyPath: [
          {
            source: 'pkg-a',
            target: 'pkg-b',
            type: 'production',
            version: '1.0.0',
          },
        ],
        foundTags: [],
        isValid: false,
      },
    ]);
  });

  test('when there are multiple matching allow constraints and a dependency has mismatched tags it returns multiple invalid results', async () => {
    const results = await getConstraintResults({
      dependencies: [
        {
          source: 'pkg-a',
          target: 'pkg-b',
          version: '1.0.0',
          type: DependencyType.PRODUCTION,
        },
      ],
      constraints: {
        'tag-one': { allow: ['tag-two'] },
        'tag-five': { allow: ['tag-six'] },
        'tag-two': { allow: ['tag-two'] },
      },
      tagsData: [
        { packageName: 'pkg-a', tags: ['tag-one', 'tag-five'] },
        { packageName: 'pkg-b', tags: ['tag-two', 'tag-three'] },
      ],
    });

    expect(results).toEqual([
      {
        filter: 'tag-one',
        constraint: {
          allow: ['tag-two'],
        },
        dependencyPath: [
          {
            source: 'pkg-a',
            target: 'pkg-b',
            type: 'production',
            version: '1.0.0',
          },
        ],
        foundTags: ['tag-two', 'tag-three'],
        isValid: true,
      },
      {
        filter: 'tag-five',
        constraint: {
          allow: ['tag-six'],
        },
        dependencyPath: [
          {
            source: 'pkg-a',
            target: 'pkg-b',
            type: 'production',
            version: '1.0.0',
          },
        ],
        foundTags: ['tag-two', 'tag-three'],
        isValid: false,
      },
    ]);
  });

  test('when there are multiple allow constraints and a dependency has matching tags it returns multiple invalid results', async () => {
    const results = await getConstraintResults({
      dependencies: [
        {
          source: 'pkg-a',
          target: 'pkg-b',
          version: '1.0.0',
          type: DependencyType.PRODUCTION,
        },
      ],
      constraints: {
        'tag-one': { allow: ['tag-two'] },
        'tag-five': { allow: ['tag-six'] },
        'tag-two': { allow: ['tag-two'] },
      },
      tagsData: [
        { packageName: 'pkg-a', tags: ['tag-one'] },
        { packageName: 'pkg-b', tags: ['tag-two'] },
      ],
    });

    expect(results).toEqual([
      {
        filter: 'tag-one',
        constraint: {
          allow: ['tag-two'],
        },
        dependencyPath: [
          {
            source: 'pkg-a',
            target: 'pkg-b',
            type: 'production',
            version: '1.0.0',
          },
        ],
        foundTags: ['tag-two'],
        isValid: true,
      },
    ]);
  });

  test('when a disallow constraint matches a dependency it returns invalid results', async () => {
    const results = await getConstraintResults({
      dependencies: [
        {
          source: 'pkg-a',
          target: 'pkg-b',
          version: '1.0.0',
          type: DependencyType.PRODUCTION,
        },
        {
          source: 'pkg-a',
          target: 'pkg-c',
          version: '1.0.0',
          type: DependencyType.PRODUCTION,
        },
      ],
      constraints: {
        'tag-one': { disallow: ['tag-three'] },
        'tag-five': { disallow: ['tag-three'] },
      },
      tagsData: [
        { packageName: 'pkg-a', tags: ['tag-one', 'tag-two'] },
        { packageName: 'pkg-b', tags: ['tag-three'] },
        { packageName: 'pkg-c', tags: ['tag-four'] },
      ],
    });

    expect(results).toEqual([
      {
        filter: 'tag-one',
        constraint: {
          disallow: ['tag-three'],
        },
        dependencyPath: [
          {
            source: 'pkg-a',
            target: 'pkg-b',
            type: 'production',
            version: '1.0.0',
          },
        ],
        foundTags: ['tag-three'],
        isValid: false,
      },
      {
        filter: 'tag-one',
        constraint: {
          disallow: ['tag-three'],
        },
        dependencyPath: [
          {
            source: 'pkg-a',
            target: 'pkg-c',
            type: 'production',
            version: '1.0.0',
          },
        ],
        foundTags: ['tag-four'],
        isValid: true,
      },
    ]);
  });

  test('when a disallow constraint and an allow constraint match a dependency it returns invalid results', async () => {
    const results = await getConstraintResults({
      dependencies: [
        {
          source: 'pkg-a',
          target: 'pkg-b',
          version: '1.0.0',
          type: DependencyType.PRODUCTION,
        },
      ],
      constraints: {
        'tag-one': { allow: ['tag-three'], disallow: ['tag-two'] },
        'tag-three': { allow: ['tag-three'], disallow: ['tag-two'] },
      },
      tagsData: [
        { packageName: 'pkg-a', tags: ['tag-one'] },
        { packageName: 'pkg-b', tags: ['tag-two', 'tag-three'] },
      ],
    });

    expect(results).toEqual([
      {
        filter: 'tag-one',
        constraint: {
          allow: ['tag-three'],
          disallow: ['tag-two'],
        },
        dependencyPath: [
          {
            source: 'pkg-a',
            target: 'pkg-b',
            type: 'production',
            version: '1.0.0',
          },
        ],
        foundTags: ['tag-two', 'tag-three'],
        isValid: false,
      },
    ]);
  });

  test('when a disallow constraint matches a transitive dependency it returns invalid results', async () => {
    const results = await getConstraintResults({
      dependencies: [
        {
          source: 'pkg-a',
          target: 'pkg-b',
          version: '1.0.0',
          type: DependencyType.PRODUCTION,
        },
        {
          source: 'pkg-a',
          target: 'pkg-b',
          version: '1.0.0',
          type: DependencyType.DEVELOPMENT,
        },
        {
          source: 'pkg-b',
          target: 'pkg-c',
          version: '1.0.0',
          type: DependencyType.PRODUCTION,
        },
        {
          source: 'pkg-c',
          target: 'pkg-d',
          version: '1.0.0',
          type: DependencyType.PRODUCTION,
        },
      ],
      constraints: {
        'tag-one': { allow: ['tag-two'], disallow: ['restricted'] },
      },
      tagsData: [
        { packageName: 'pkg-a', tags: ['tag-one'] },
        { packageName: 'pkg-b', tags: [] },
        { packageName: 'pkg-c', tags: [] },
        { packageName: 'pkg-d', tags: ['restricted'] },
      ],
    });

    expect(results).toEqual([
      {
        constraint: {
          allow: ['tag-two'],
          disallow: ['restricted'],
        },
        dependencyPath: [
          {
            source: 'pkg-a',
            target: 'pkg-b',
            type: 'production',
            version: '1.0.0',
          },
          {
            source: 'pkg-b',
            target: 'pkg-c',
            type: 'production',
            version: '1.0.0',
          },
          {
            source: 'pkg-c',
            target: 'pkg-d',
            type: 'production',
            version: '1.0.0',
          },
        ],
        filter: 'tag-one',
        foundTags: ['restricted'],
        isValid: false,
      },
      {
        constraint: {
          allow: ['tag-two'],
          disallow: ['restricted'],
        },
        dependencyPath: [
          {
            source: 'pkg-a',
            target: 'pkg-b',
            type: 'development',
            version: '1.0.0',
          },
          {
            source: 'pkg-b',
            target: 'pkg-c',
            type: 'production',
            version: '1.0.0',
          },
          {
            source: 'pkg-c',
            target: 'pkg-d',
            type: 'production',
            version: '1.0.0',
          },
        ],
        filter: 'tag-one',
        foundTags: ['restricted'],
        isValid: false,
      },
    ]);
  });

  test('when a disallow constraint matches all dependencies it returns invalid results', async () => {
    const results = await getConstraintResults({
      dependencies: [
        {
          source: 'pkg-a',
          target: 'pkg-b',
          version: '1.0.0',
          type: DependencyType.PRODUCTION,
        },
      ],
      constraints: {
        '*': { disallow: ['tag-two'] },
      },
      tagsData: [
        { packageName: 'pkg-a', tags: ['tag-one'] },
        { packageName: 'pkg-b', tags: ['tag-two'] },
      ],
    });

    expect(results).toEqual([
      {
        filter: '*',
        constraint: {
          disallow: ['tag-two'],
        },
        dependencyPath: [
          {
            source: 'pkg-a',
            target: 'pkg-b',
            type: 'production',
            version: '1.0.0',
          },
        ],
        foundTags: ['tag-two'],
        isValid: false,
      },
    ]);
  });

  test('when a disallow all constraint and an allow constraint match a dependency with no tags it returns invalid results', async () => {
    const results = await getConstraintResults({
      dependencies: [
        {
          source: 'pkg-a',
          target: 'pkg-b',
          version: '1.0.0',
          type: DependencyType.PRODUCTION,
        },
      ],
      constraints: {
        'tag-one': { allow: ['tag-two'], disallow: '*' },
      },
      tagsData: [
        { packageName: 'pkg-a', tags: ['tag-one'] },
        { packageName: 'pkg-b', tags: [] },
      ],
    });

    expect(results).toEqual([
      {
        filter: 'tag-one',
        constraint: {
          allow: ['tag-two'],
          disallow: '*',
        },
        dependencyPath: [
          {
            source: 'pkg-a',
            target: 'pkg-b',
            type: 'production',
            version: '1.0.0',
          },
        ],
        foundTags: [],
        isValid: false,
      },
    ]);
  });

  test('when a disallow all constraint and an allow constraint match a dependency with allowed tags it returns invalid results', async () => {
    const results = await getConstraintResults({
      dependencies: [
        {
          source: 'pkg-a',
          target: 'pkg-b',
          version: '1.0.0',
          type: DependencyType.PRODUCTION,
        },
      ],
      constraints: {
        'tag-one': { allow: ['tag-two'], disallow: '*' },
      },
      tagsData: [
        { packageName: 'pkg-a', tags: ['tag-one'] },
        { packageName: 'pkg-b', tags: ['tag-two'] },
      ],
    });

    expect(results).toEqual([
      {
        filter: 'tag-one',
        constraint: {
          allow: ['tag-two'],
          disallow: '*',
        },
        dependencyPath: [
          {
            source: 'pkg-a',
            target: 'pkg-b',
            type: 'production',
            version: '1.0.0',
          },
        ],
        foundTags: ['tag-two'],
        isValid: false,
      },
    ]);
  });

  test('kitchen sink', async () => {
    const results = await getConstraintResults({
      dependencies: [
        {
          source: 'pkg-one',
          target: 'pkg-two',
          version: '1.0.0',
          type: DependencyType.PRODUCTION,
        },
        {
          source: 'pkg-one',
          target: 'pkg-three',
          version: '1.0.0',
          type: DependencyType.PRODUCTION,
        },
        {
          source: 'pkg-one',
          target: 'pkg-four',
          version: '1.0.0',
          type: DependencyType.PRODUCTION,
        },
        {
          source: 'pkg-three',
          target: 'pkg-one',
          version: '1.0.0',
          type: DependencyType.PRODUCTION,
        },
        {
          source: 'pkg-four',
          target: 'pkg-six',
          version: '1.0.0',
          type: DependencyType.PRODUCTION,
        },
      ],
      constraints: {
        feature: { allow: '*' },
        data: { allow: ['config'] },
        utility: { allow: ['data'] },
        config: { allow: ['config'] },
        'not-allowed': { disallow: ['config'] },
      },
      tagsData: [
        {
          packageName: 'pkg-one',
          tags: ['feature'],
        },
        {
          packageName: 'pkg-two',
          tags: ['data'],
        },
        {
          packageName: 'pkg-three',
          tags: ['config'],
        },
        {
          packageName: 'pkg-four',
          tags: ['utility'],
        },
        {
          packageName: 'pkg-five',
          tags: ['config'],
        },
        {
          packageName: 'pkg-six',
          tags: ['not-allowed'],
        },
      ],
    });

    expect(results).toEqual([
      {
        filter: 'feature',
        constraint: {
          allow: '*',
        },
        dependencyPath: [
          {
            source: 'pkg-one',
            target: 'pkg-two',
            type: 'production',
            version: '1.0.0',
          },
        ],
        foundTags: ['data'],
        isValid: true,
      },
      {
        filter: 'feature',
        constraint: {
          allow: '*',
        },
        dependencyPath: [
          {
            source: 'pkg-one',
            target: 'pkg-three',
            type: 'production',
            version: '1.0.0',
          },
        ],
        foundTags: ['config'],
        isValid: true,
      },
      {
        filter: 'feature',
        constraint: {
          allow: '*',
        },
        dependencyPath: [
          {
            source: 'pkg-one',
            target: 'pkg-four',
            type: 'production',
            version: '1.0.0',
          },
        ],
        foundTags: ['utility'],
        isValid: true,
      },
      {
        filter: 'utility',
        constraint: {
          allow: ['data'],
        },
        dependencyPath: [
          {
            source: 'pkg-four',
            target: 'pkg-six',
            type: 'production',
            version: '1.0.0',
          },
        ],
        foundTags: ['not-allowed'],
        isValid: false,
      },
      {
        filter: 'config',
        constraint: {
          allow: ['config'],
        },
        dependencyPath: [
          {
            source: 'pkg-three',
            target: 'pkg-one',
            type: 'production',
            version: '1.0.0',
          },
        ],
        foundTags: ['feature'],
        isValid: false,
      },
    ]);
  });
});
