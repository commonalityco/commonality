import { beforeEach, describe, expect, test, vi } from 'vitest';
import { reportConstraintResults } from './constrain';
import { DependencyType } from '@commonalityco/utils-core';
import stripAnsi from 'strip-ansi';
import { ConstraintResult } from '@commonalityco/types';

import process from 'node:process';
import console from 'node:console';

vi.mock('node:process', async () => ({
  default: {
    ...(await vi.importActual<NodeJS.Process>('node:process')),
    exit: vi.fn(),
  },
}));

vi.mock('node:console', async () => ({
  default: {
    ...(await vi.importActual<Console>('node:console')),
    log: vi.fn().mockImplementation(() => {}),
  },
}));

const getConsoleCalls = () => {
  return vi
    .mocked(console.log)
    .mock?.calls?.map((call) => call.map((item) => stripAnsi(item)));
};

describe('constrain', () => {
  beforeEach(() => {
    vi.mocked(process.exit).mockReset();
    vi.mocked(console.log).mockReset();
  });

  test('when allow all constraints match dependencies with no tags and verbose is false it displays the correct output', async () => {
    const results = [
      {
        constraint: {
          allow: '*',
        },
        dependencyPath: [
          {
            source: 'pkg-one',
            target: 'pkg-two',
            type: DependencyType.PRODUCTION,
            version: '1.0.0',
          },
        ],
        filter: '*',
        foundTags: undefined,
        isValid: true,
      },
    ] satisfies ConstraintResult[];

    await reportConstraintResults({
      results,
      verbose: false,
    });

    expect(process.exit).not.toHaveBeenCalled();
    expect(getConsoleCalls()).toMatchInlineSnapshot(
      `
        [
          [
            "
        ✓ pkg-one (1)

        Packages:    0 failed 1 passed (1)
        Constraints: 0 failed 1 passed (1)",
          ],
        ]
      `,
    );
  });

  test('when allow all constraints match dependencies with no tags and verbose is true it displays the correct output', async () => {
    const results = [
      {
        constraint: {
          allow: '*',
        },
        dependencyPath: [
          {
            source: 'pkg-one',
            target: 'pkg-two',
            type: DependencyType.PRODUCTION,
            version: '1.0.0',
          },
        ],
        filter: '*',
        foundTags: undefined,
        isValid: true,
      },
    ] satisfies ConstraintResult[];

    await reportConstraintResults({
      results,
      verbose: true,
    });

    expect(process.exit).not.toHaveBeenCalled();
    expect(getConsoleCalls()).toMatchInlineSnapshot(`
      [
        [
          "
      ❯ pkg-one (1)
      # * (1)
      ↳ pass pkg-two prod
      │      Allowed: *
      │      Found:   No tags found
      │      

      Packages:    0 failed 1 passed (1)
      Constraints: 0 failed 1 passed (1)",
        ],
      ]
    `);
  });

  test('when allow constraints match dependencies with invalid tags and verbose is false it displays the correct output', async () => {
    const results = [
      {
        constraint: {
          allow: ['tag-two'],
        },
        dependencyPath: [
          {
            source: 'pkg-one',
            target: 'pkg-two',
            type: DependencyType.PRODUCTION,
            version: '1.0.0',
          },
        ],
        filter: 'tag-one',
        foundTags: ['tag-three'],
        isValid: false,
      },
    ] satisfies ConstraintResult[];

    await reportConstraintResults({
      results,
      verbose: false,
    });

    expect(process.exit).toHaveBeenCalledWith(1);
    expect(getConsoleCalls()).toMatchInlineSnapshot(`
      [
        [
          "
      ❯ pkg-one (1)
      # tag-one (1)
      ↳ fail pkg-two prod
      │      Allowed: #tag-two
      │      Found:   #tag-three
      │      

      Packages:    1 failed 0 passed (1)
      Constraints: 1 failed 0 passed (1)",
        ],
      ]
    `);
  });

  test('when disallow constraints match dependencies with invalid tags and verbose is false it displays the correct output', async () => {
    const results = [
      {
        constraint: {
          disallow: ['tag-three'],
        },
        dependencyPath: [
          {
            source: 'pkg-one',
            target: 'pkg-two',
            type: DependencyType.PRODUCTION,
            version: '1.0.0',
          },
        ],
        filter: 'tag-one',
        foundTags: ['tag-three'],
        isValid: false,
      },
    ] satisfies ConstraintResult[];

    await reportConstraintResults({
      results,
      verbose: false,
    });

    expect(process.exit).toHaveBeenCalledWith(1);
    expect(getConsoleCalls()).toMatchInlineSnapshot(`
      [
        [
          "
      ❯ pkg-one (1)
      # tag-one (1)
      ↳ fail pkg-two prod
      │      Disallowed: #tag-three
      │      Found:      #tag-three
      │      

      Packages:    1 failed 0 passed (1)
      Constraints: 1 failed 0 passed (1)",
        ],
      ]
    `);
  });

  test('when disallow constraints match dependencies with invalid tags and verbose is true it displays the correct output', async () => {
    const results = [
      {
        constraint: {
          disallow: ['tag-three'],
        },
        dependencyPath: [
          {
            source: 'pkg-one',
            target: 'pkg-two',
            type: DependencyType.PRODUCTION,
            version: '1.0.0',
          },
        ],
        filter: 'tag-one',
        foundTags: ['tag-three'],
        isValid: false,
      },
    ] satisfies ConstraintResult[];

    await reportConstraintResults({
      results,
      verbose: true,
    });

    expect(process.exit).toHaveBeenCalledWith(1);
    expect(getConsoleCalls()).toMatchInlineSnapshot(`
      [
        [
          "
      ❯ pkg-one (1)
      # tag-one (1)
      ↳ fail pkg-two prod
      │      Disallowed: #tag-three
      │      Found:      #tag-three
      │      

      Packages:    1 failed 0 passed (1)
      Constraints: 1 failed 0 passed (1)",
        ],
      ]
    `);
  });

  test('when disallow constraints match transitive dependencies with invalid tags and verbose is true it displays the correct output', async () => {
    const results = [
      {
        constraint: {
          disallow: ['tag-three'],
        },
        dependencyPath: [
          {
            source: 'pkg-one',
            target: 'pkg-two',
            type: DependencyType.PRODUCTION,
            version: '1.0.0',
          },
          {
            source: 'pkg-two',
            target: 'pkg-three',
            type: DependencyType.PRODUCTION,
            version: '1.0.0',
          },
        ],
        filter: 'tag-one',
        foundTags: ['tag-three'],
        isValid: false,
      },
    ] satisfies ConstraintResult[];

    await reportConstraintResults({
      results,
      verbose: true,
    });

    expect(process.exit).toHaveBeenCalledWith(1);
    expect(getConsoleCalls()).toMatchInlineSnapshot(`
      [
        [
          "
      ❯ pkg-one (1)
      # tag-one (1)
      ↳ fail pkg-two prod → pkg-three prod
      │      Disallowed: #tag-three
      │      Found:      #tag-three
      │      

      Packages:    1 failed 0 passed (1)
      Constraints: 1 failed 0 passed (1)",
        ],
      ]
    `);
  });

  test('when there are no results', async () => {
    const results = [] satisfies ConstraintResult[];

    await reportConstraintResults({
      results,
      verbose: true,
    });

    expect(process.exit).not.toHaveBeenCalled();
    expect(getConsoleCalls()).toMatchInlineSnapshot(`
      [
        [
          "
      No constraints found
      Add constraints to your commonality.json to limit dependencies",
        ],
      ]
    `);
  });
});
