import {
  Constraint,
  Dependency,
  Package,
  ProjectConfig,
  TagsData,
  Violation,
} from '@commonalityco/types';
import { DependencyType, PackageType } from '@commonalityco/utils-core';
import { getViolations } from '../src/get-violations.js';
import { describe, it, expect } from 'vitest';

const basePkgOne = {
  path: '/pkgs/pkg-one',
  name: '@scope/pkg-one',
  description: 'A package',
  version: '1.0.0',
  type: PackageType.NODE,
} satisfies Package;

const basePkgTwo = {
  path: '/pkgs/pkg-two',
  name: '@scope/pkg-two',
  description: 'A package',
  version: '1.0.0',
  type: PackageType.NODE,
} satisfies Package;

const baseTagsData = [
  { packageName: basePkgOne.name, tags: ['tag-one'] },
  { packageName: basePkgTwo.name, tags: ['tag-two', 'tag-three'] },
] satisfies TagsData[];

const dependencyOne = {
  source: basePkgOne.name,
  target: basePkgTwo.name,
  version: '1.0.0',
  type: DependencyType.PRODUCTION,
} satisfies Dependency;

describe('getViolations', () => {
  describe('when there are no constraints defined', () => {
    it('does not return violations', async () => {
      const violations = await getViolations({
        dependencies: [dependencyOne],
        constraints: [],
        tagsData: baseTagsData,
      });

      expect(violations).toEqual([]);
    });
  }),
    describe('when there are no packages that have tags', () => {
      const tagsData = [] satisfies TagsData[];

      it('does not return violations', async () => {
        const violations = await getViolations({
          dependencies: [dependencyOne],
          constraints: [{ applyTo: 'tag-one', allow: ['tag-two'] }],
          tagsData,
        });

        expect(violations).toEqual([]);
      });
    });

  describe('when a package has tags', () => {
    describe('and there are no tags that match a constraint', () => {
      const tagsData = [
        { packageName: basePkgOne.name, tags: ['tag-one'] },
      ] satisfies TagsData[];
      const constraints = [{ applyTo: 'tag-four', allow: ['tag-five'] }];

      it('does not return violations', async () => {
        const violations = await getViolations({
          dependencies: [dependencyOne],
          constraints,
          tagsData,
        });

        expect(violations).toEqual([]);
      });
    });

    describe('and it has tags that matches a constraint', () => {
      describe('and the constraint allows a wildcard', () => {
        const constraints = [
          { applyTo: 'tag-one', allow: '*' },
          { applyTo: 'restricted', allow: ['restricted'] },
        ] satisfies ProjectConfig['constraints'];

        describe('and has a dependency that does not have any tags', () => {
          const tagsData = [
            { packageName: basePkgOne.name, tags: ['tag-one'] },
            { packageName: basePkgTwo.name, tags: [] },
          ] satisfies TagsData[];

          it('does not return a violation', async () => {
            const violations = await getViolations({
              dependencies: [dependencyOne],
              constraints,
              tagsData,
            });

            expect(violations).toEqual([]);
          });
        });

        describe('and has a dependency that has tags', () => {
          const tagsData = [
            { packageName: basePkgOne.name, tags: ['tag-one', 'restricted'] },
            { packageName: basePkgTwo.name, tags: ['foo'] },
          ] satisfies TagsData[];

          it('does not return a violation', async () => {
            const violations = await getViolations({
              dependencies: [dependencyOne],
              constraints,
              tagsData,
            });

            expect(violations).toEqual([]);
          });
        });
      });

      describe('and the constraint allows specific tags', () => {
        describe('and has a dependency that does not have any tags', () => {
          const constraints = [{ applyTo: 'tag-one', allow: ['tag-two'] }];
          const tagsData = [
            { packageName: basePkgOne.name, tags: ['tag-one'] },
            { packageName: basePkgTwo.name, tags: [] },
          ] satisfies TagsData[];

          it('returns violations', async () => {
            const violations = await getViolations({
              dependencies: [dependencyOne],
              constraints,
              tagsData,
            });

            expect(violations).toEqual([
              {
                sourcePackageName: '@scope/pkg-one',
                targetPackageName: '@scope/pkg-two',
                appliedTo: 'tag-one',
                found: [],
                disallowed: [],
                allowed: ['tag-two'],
              },
            ]);
          });
        });

        describe('and has a dependency that has tags that are not allowed by the constraint', () => {
          const constraints = [{ applyTo: 'tag-one', allow: ['tag-two'] }];
          const tagsData = [
            { packageName: basePkgOne.name, tags: ['tag-one'] },
            { packageName: basePkgTwo.name, tags: ['tag-three'] },
          ] satisfies TagsData[];

          it('returns violations', async () => {
            const violations = await getViolations({
              dependencies: [dependencyOne],
              constraints,
              tagsData,
            });

            expect(violations).toEqual([
              {
                sourcePackageName: '@scope/pkg-one',
                targetPackageName: '@scope/pkg-two',
                appliedTo: 'tag-one',
                found: ['tag-three'],
                allowed: ['tag-two'],
                disallowed: [],
              },
            ]);
          });
        });

        describe('and has a dependency that has tags that are allowed by the constraint', () => {
          const constraints = [{ applyTo: 'tag-one', allow: ['tag-two'] }];
          const tagsData = [
            { packageName: basePkgOne.name, tags: ['tag-one'] },
            { packageName: basePkgTwo.name, tags: ['tag-two'] },
          ] satisfies TagsData[];

          it('does not return a violation', async () => {
            const violations = await getViolations({
              dependencies: [dependencyOne],
              constraints,
              tagsData,
            });

            expect(violations).toEqual([]);
          });
        });
      });
    });

    describe('and it has multiple tags that match multiple constraints', () => {
      const constraints = [
        { applyTo: 'tag-one', allow: ['tag-two'] },
        { applyTo: 'tag-five', allow: ['tag-two'] },
        { applyTo: 'tag-two', allow: ['tag-two'] },
        { applyTo: 'tag-five', allow: ['tag-six'] },
      ];

      describe('and the package has a dependency that does not have any tags', () => {
        const tagsData = [
          { packageName: basePkgOne.name, tags: ['tag-one', 'tag-five'] },
          { packageName: basePkgTwo.name, tags: [] },
        ] satisfies TagsData[];

        it('returns violations', async () => {
          const violations = await getViolations({
            dependencies: [dependencyOne],
            constraints,
            tagsData,
          });

          expect(violations).toEqual(
            expect.arrayContaining([
              {
                allowed: ['tag-two'],
                disallowed: [],
                found: [],
                appliedTo: 'tag-one',
                sourcePackageName: '@scope/pkg-one',
                targetPackageName: '@scope/pkg-two',
              },
              {
                allowed: ['tag-six'],
                disallowed: [],
                found: [],
                appliedTo: 'tag-five',
                sourcePackageName: '@scope/pkg-one',
                targetPackageName: '@scope/pkg-two',
              },
            ]),
          );
        });
      });

      describe('and the package has a dependency that has tags that are not allowed by the constraint', () => {
        const tagsData = [
          { packageName: basePkgOne.name, tags: ['tag-one', 'tag-five'] },
          { packageName: basePkgTwo.name, tags: ['tag-two', 'tag-three'] },
        ] satisfies TagsData[];

        it('returns multiple violations', async () => {
          const violations = await getViolations({
            dependencies: [dependencyOne],
            constraints,
            tagsData,
          });

          expect(violations).toEqual(
            expect.arrayContaining([
              {
                allowed: ['tag-six'],
                disallowed: [],
                found: ['tag-two', 'tag-three'],
                appliedTo: 'tag-five',
                sourcePackageName: '@scope/pkg-one',
                targetPackageName: '@scope/pkg-two',
              },
            ]),
          );
        });
      });

      describe('and the package has a dependency that has tags that are allowed by the constraint', () => {
        const tagsData = [
          { packageName: basePkgOne.name, tags: ['tag-one'] },
          { packageName: basePkgTwo.name, tags: ['tag-two'] },
        ] satisfies TagsData[];

        it('does not return violations', async () => {
          const violations = await getViolations({
            dependencies: [dependencyOne],
            constraints,
            tagsData,
          });

          expect(violations).toEqual([]);
        });
      });
    });
  });

  it('should produce a violation when a dependency has a disallowed tag', async () => {
    const constraints = [{ applyTo: 'tag-one', disallow: ['tag-two'] }];

    const tagsData = [
      { packageName: basePkgOne.name, tags: ['tag-one'] },
      { packageName: basePkgTwo.name, tags: ['tag-two', 'tag-three'] },
    ] satisfies TagsData[];

    const expectedViolation = {
      sourcePackageName: '@scope/pkg-one',
      targetPackageName: '@scope/pkg-two',
      appliedTo: 'tag-one',
      allowed: [],
      disallowed: ['tag-two'],
      found: ['tag-two', 'tag-three'],
    } satisfies Violation;

    const violations = await getViolations({
      constraints,
      dependencies: [dependencyOne],
      tagsData,
    });

    expect(violations).toEqual([expectedViolation]);
  });

  it('should produce a violation when a dependency has both an allowed tag and a disallowed tag', async () => {
    const constraints = [
      { applyTo: 'tag-one', allow: ['tag-three'], disallow: ['tag-two'] },
    ];

    const expectedViolation: Violation = {
      sourcePackageName: '@scope/pkg-one',
      targetPackageName: '@scope/pkg-two',
      appliedTo: 'tag-one',
      allowed: ['tag-three'],
      disallowed: ['tag-two'],
      found: ['tag-two', 'tag-three'],
    };

    const tagsData = [
      { packageName: basePkgOne.name, tags: ['tag-one'] },
      { packageName: basePkgTwo.name, tags: ['tag-two', 'tag-three'] },
    ] satisfies TagsData[];

    const violations = await getViolations({
      constraints,
      dependencies: [dependencyOne],
      tagsData,
    });

    expect(violations).toEqual([expectedViolation]);
  });

  it('should produce a violation when an indirect dependency has a disallowed tag', async () => {
    const constraints = [
      { applyTo: 'tag-one', allow: ['tag-two'], disallow: ['tag-four'] },
    ];

    const dependencies = [
      dependencyOne,
      {
        source: basePkgTwo.name,
        target: '@scope/pkg-three',
        version: '1.0.0',
        type: DependencyType.PRODUCTION,
      },
    ] satisfies Dependency[];

    const tagsData = [
      { packageName: basePkgOne.name, tags: ['tag-one'] },
      { packageName: basePkgTwo.name, tags: ['tag-two', 'tag-three'] },
      { packageName: '@scope/pkg-three', tags: ['tag-four'] },
    ] satisfies TagsData[];

    const expectedViolation: Violation = {
      sourcePackageName: '@scope/pkg-one',
      targetPackageName: '@scope/pkg-three',
      appliedTo: 'tag-one',
      allowed: ['tag-two'],
      disallowed: ['tag-four'],
      found: ['tag-four'],
    };

    const violations = await getViolations({
      constraints,
      dependencies,
      tagsData,
    });

    expect(violations).toEqual([expectedViolation]);
  });

  describe('when a constraint is applied to all packages', () => {
    const constraints = [
      { applyTo: '*', disallow: ['tag-two'] },
    ] satisfies Constraint[];

    const tagsData = [
      { packageName: basePkgOne.name, tags: ['tag-one'] },
      { packageName: basePkgTwo.name, tags: ['tag-two'] },
    ] satisfies TagsData[];

    it('is run against every package', async () => {
      const violations = await getViolations({
        constraints,
        dependencies: [dependencyOne],
        tagsData,
      });

      const expectedViolations = [
        {
          allowed: [],
          appliedTo: '*',
          disallowed: ['tag-two'],
          found: ['tag-two'],
          sourcePackageName: '@scope/pkg-one',
          targetPackageName: '@scope/pkg-two',
        },
      ] satisfies Violation[];

      expect(violations).toStrictEqual(expectedViolations);
    });
  });

  describe('when a constraint disallows all tags', () => {
    describe('and allows some tags', () => {
      const constraints = [
        { applyTo: 'tag-one', allow: ['tag-two'], disallow: '*' },
      ];

      describe('and a dependency has no tags', () => {
        const tagsData = [
          { packageName: basePkgOne.name, tags: ['tag-one'] },
          { packageName: basePkgTwo.name, tags: [] },
        ] satisfies TagsData[];

        it('should return violations', async () => {
          const expectedViolation = {
            sourcePackageName: '@scope/pkg-one',
            targetPackageName: '@scope/pkg-two',
            appliedTo: 'tag-one',
            allowed: ['tag-two'],
            disallowed: '*',
            found: [],
          } satisfies Violation;

          const violations = await getViolations({
            constraints,
            dependencies: [dependencyOne],
            tagsData,
          });

          expect(violations).toEqual([expectedViolation]);
        });
      });

      describe('and a dependency has tags', () => {
        const tagsData = [
          { packageName: basePkgOne.name, tags: ['tag-one'] },
          { packageName: basePkgTwo.name, tags: ['tag-two'] },
        ] satisfies TagsData[];

        it('should return violations', async () => {
          const expectedViolation: Violation = {
            sourcePackageName: '@scope/pkg-one',
            targetPackageName: '@scope/pkg-two',
            appliedTo: 'tag-one',
            allowed: ['tag-two'],
            disallowed: '*',
            found: ['tag-two'],
          };

          const violations = await getViolations({
            constraints,
            dependencies: [dependencyOne],
            tagsData,
          });

          expect(violations).toEqual([expectedViolation]);
        });
      });
    });

    describe('and allows no tags', () => {
      const constraints = [
        { applyTo: 'tag-one', disallow: '*' },
      ] satisfies Constraint[];

      describe('and a dependency has no tags', () => {
        const tagsData = [
          { packageName: basePkgOne.name, tags: ['tag-one'] },
          { packageName: basePkgTwo.name, tags: [] },
        ] satisfies TagsData[];

        it('should return violations', async () => {
          const expectedViolation: Violation = {
            sourcePackageName: '@scope/pkg-one',
            targetPackageName: '@scope/pkg-two',
            appliedTo: 'tag-one',
            allowed: [],
            disallowed: '*',
            found: [],
          };

          const violations = await getViolations({
            constraints,
            dependencies: [dependencyOne],
            tagsData,
          });

          expect(violations).toEqual([expectedViolation]);
        });
      });

      describe('and a dependency has tags', () => {
        const tagsData = [
          { packageName: basePkgOne.name, tags: ['tag-one'] },
          { packageName: basePkgTwo.name, tags: ['tag-two'] },
        ] satisfies TagsData[];

        it('should return violations', async () => {
          const expectedViolation: Violation = {
            sourcePackageName: '@scope/pkg-one',
            targetPackageName: '@scope/pkg-two',
            appliedTo: 'tag-one',
            allowed: [],
            disallowed: '*',
            found: ['tag-two'],
          };

          const violations = await getViolations({
            constraints,
            dependencies: [dependencyOne],
            tagsData,
          });

          expect(violations).toEqual([expectedViolation]);
        });
      });
    });
  });

  describe('when all types of packages and constraints are mixed together', () => {
    const dependencies = [
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
    ] satisfies Dependency[];

    const tagsData = [
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
    ];

    const constraints = [
      { applyTo: 'feature', allow: '*' },
      { applyTo: 'data', allow: ['config'] },
      { applyTo: 'utility', allow: ['data'] },
      { applyTo: 'config', allow: ['config'] },
    ] satisfies Constraint[];

    it('returns violations', async () => {
      const violations = await getViolations({
        dependencies,
        constraints,
        tagsData,
      });

      expect(violations).toEqual(
        expect.arrayContaining([
          {
            sourcePackageName: 'pkg-four',
            targetPackageName: 'pkg-six',
            appliedTo: 'utility',
            found: ['not-allowed'],
            allowed: ['data'],
            disallowed: [],
          },
          {
            sourcePackageName: 'pkg-three',
            targetPackageName: 'pkg-one',
            appliedTo: 'config',
            found: ['feature'],
            allowed: ['config'],
            disallowed: [],
          },
        ]),
      );
    });
  });
});
