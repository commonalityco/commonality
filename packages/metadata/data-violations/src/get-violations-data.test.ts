import {
  Package,
  ProjectConfig,
  TagsData,
  Violation,
} from '@commonalityco/types';
import { DependencyType } from '@commonalityco/utils-core';
import { getViolationsData } from './get-violations-data';
import { describe, it, expect } from 'vitest';

const basePkgOne = {
  path: '/pkgs/pkg-one',
  name: '@scope/pkg-one',
  description: 'A package',
  version: '1.0.0',
  dependencies: [
    {
      name: '@scope/pkg-two',
      version: '1.0.0',
      type: DependencyType.PRODUCTION,
    },
  ],
} satisfies Package;

const basePkgTwo = {
  path: '/pkgs/pkg-two',
  name: '@scope/pkg-two',
  description: 'A package',
  version: '1.0.0',
  dependencies: [],
} satisfies Package;

const baseTagsData = [
  { packageName: basePkgOne.name, tags: ['tag-one'] },
  { packageName: basePkgTwo.name, tags: ['tag-two', 'tag-three'] },
] satisfies TagsData[];

describe('getViolations', () => {
  describe('when there are no constraints defined', () => {
    const packages = [basePkgOne, basePkgTwo];

    it('does not return violations', async () => {
      const violations = await getViolationsData({
        packages,
        projectConfig: {},
        tagsData: baseTagsData,
      });

      expect(violations).toEqual([]);
    });
  }),
    describe('when there are no packages that have tags', () => {
      const packages = [{ ...basePkgOne, tags: [] }];
      const tagsData = [] satisfies TagsData[];

      it('does not return violations', async () => {
        const violations = await getViolationsData({
          packages,
          projectConfig: {
            constraints: [{ applyTo: 'tag-one', allow: ['tag-two'] }],
          },
          tagsData,
        });

        expect(violations).toEqual([]);
      });
    });

  describe('when a package has tags', () => {
    describe('and there are no tags that match a constraint', () => {
      const packages = [basePkgOne];
      const tagsData = [
        { packageName: basePkgOne.name, tags: ['tag-one'] },
      ] satisfies TagsData[];
      const constraints = [{ applyTo: 'tag-four', allow: ['tag-five'] }];

      it('does not return violations', async () => {
        const violations = await getViolationsData({
          packages,
          projectConfig: {
            constraints,
          },
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
          const packages = [basePkgOne, basePkgTwo] satisfies Package[];

          it('does not return a violation', async () => {
            const violations = await getViolationsData({
              packages,
              projectConfig: {
                constraints,
              },
              tagsData,
            });

            expect(violations).toEqual([]);
          });
        });

        describe('and has a dependency that does have tags', () => {
          const tagsData = [
            { packageName: basePkgOne.name, tags: ['tag-one', 'restricted'] },
            { packageName: basePkgTwo.name, tags: ['foo'] },
          ] satisfies TagsData[];
          const packages = [basePkgOne, basePkgTwo] satisfies Package[];

          it('does not return a violation', async () => {
            const violations = await getViolationsData({
              packages,
              projectConfig: {
                constraints,
              },
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
          const packages = [basePkgOne, basePkgTwo] satisfies Package[];

          it('returns violations', async () => {
            const violations = await getViolationsData({
              packages,
              projectConfig: {
                constraints,
              },
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
          const packages = [basePkgOne, basePkgTwo] satisfies Package[];

          it('returns violations', async () => {
            const violations = await getViolationsData({
              packages,
              projectConfig: {
                constraints,
              },
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
          const packages = [basePkgOne, basePkgTwo] satisfies Package[];

          it('does not return a violation', async () => {
            const violations = await getViolationsData({
              packages,
              projectConfig: {
                constraints,
              },
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
        const packages = [basePkgOne, basePkgTwo] satisfies Package[];

        it('returns violations', async () => {
          const violations = await getViolationsData({
            packages,
            projectConfig: {
              constraints,
            },
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
            ])
          );
        });
      });

      describe('and the package has a dependency that has tags that are not allowed by the constraint', () => {
        const packages = [basePkgOne, basePkgTwo] satisfies Package[];
        const tagsData = [
          { packageName: basePkgOne.name, tags: ['tag-one', 'tag-five'] },
          { packageName: basePkgTwo.name, tags: ['tag-two', 'tag-three'] },
        ] satisfies TagsData[];

        it('returns multiple violations', async () => {
          const violations = await getViolationsData({
            packages,
            projectConfig: {
              constraints,
            },
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
            ])
          );
        });
      });

      describe('and the package has a dependency that has tags that are allowed by the constraint', () => {
        const packages = [basePkgOne, basePkgTwo] satisfies Package[];
        const tagsData = [
          { packageName: basePkgOne.name, tags: ['tag-one'] },
          { packageName: basePkgTwo.name, tags: ['tag-two'] },
        ] satisfies TagsData[];

        it('does not return violations', async () => {
          const violations = await getViolationsData({
            packages,
            projectConfig: {
              constraints,
            },
            tagsData,
          });

          expect(violations).toEqual([]);
        });
      });
    });
  });

  it('should produce a violation when a dependency has a disallowed tag', async () => {
    const projectConfig = {
      constraints: [{ applyTo: 'tag-one', disallow: ['tag-two'] }],
    };
    const packages = [basePkgOne, basePkgTwo] satisfies Package[];
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

    const violations = await getViolationsData({
      projectConfig,
      packages,
      tagsData,
    });

    expect(violations).toEqual([expectedViolation]);
  });

  it('should produce a violation when a dependency has both an allowed tag and a disallowed tag', async () => {
    const projectConfig = {
      constraints: [
        { applyTo: 'tag-one', allow: ['tag-three'], disallow: ['tag-two'] },
      ],
    };

    const expectedViolation: Violation = {
      sourcePackageName: '@scope/pkg-one',
      targetPackageName: '@scope/pkg-two',
      appliedTo: 'tag-one',
      allowed: ['tag-three'],
      disallowed: ['tag-two'],
      found: ['tag-two', 'tag-three'],
    };

    const packages = [basePkgOne, basePkgTwo] satisfies Package[];
    const tagsData = [
      { packageName: basePkgOne.name, tags: ['tag-one'] },
      { packageName: basePkgTwo.name, tags: ['tag-two', 'tag-three'] },
    ] satisfies TagsData[];

    const violations = await getViolationsData({
      projectConfig,
      packages,
      tagsData,
    });

    expect(violations).toEqual([expectedViolation]);
  });

  it('should produce a violation when an indirect dependency has a disallowed tag', async () => {
    const projectConfig = {
      constraints: [
        { applyTo: 'tag-one', allow: ['tag-two'], disallow: ['tag-four'] },
      ],
    };

    const packages = [
      basePkgOne,
      {
        ...basePkgTwo,
        dependencies: [
          {
            name: '@scope/pkg-three',
            version: '1.0.0',
            type: DependencyType.PRODUCTION,
          },
        ],
      },
      {
        name: '@scope/pkg-three',
        path: '/',
        version: '1.0.0',
        dependencies: [],
      },
    ] satisfies Package[];
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

    const violations = await getViolationsData({
      projectConfig,
      packages,
      tagsData,
    });

    expect(violations).toEqual([expectedViolation]);
  });

  describe('when a constraint is applied to all packages', () => {
    const packages = [basePkgOne, basePkgTwo];
    const projectConfig = {
      constraints: [{ applyTo: '*', disallow: ['tag-two'] }],
    } satisfies ProjectConfig;
    const tagsData = [
      { packageName: basePkgOne.name, tags: ['tag-one'] },
      { packageName: basePkgTwo.name, tags: ['tag-two'] },
    ] satisfies TagsData[];

    it('is run against every package', async () => {
      const violations = await getViolationsData({
        projectConfig,
        packages,
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

      expect(violations).toEqual(expectedViolations);
    });
  });

  describe('when a constraint disallows all tags', () => {
    const packages = [basePkgOne, basePkgTwo];

    describe('and allows some tags', () => {
      const projectConfig = {
        constraints: [
          { applyTo: 'tag-one', allow: ['tag-two'], disallow: '*' },
        ],
      };

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

          const violations = await getViolationsData({
            projectConfig,
            packages,
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

          const violations = await getViolationsData({
            projectConfig,
            packages,
            tagsData,
          });

          expect(violations).toEqual([expectedViolation]);
        });
      });
    });

    describe('and allows no tags', () => {
      const projectConfig = {
        constraints: [{ applyTo: 'tag-one', disallow: '*' }],
      } satisfies ProjectConfig;

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

          const violations = await getViolationsData({
            projectConfig,
            packages,
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

          const violations = await getViolationsData({
            projectConfig,
            packages,
            tagsData,
          });

          expect(violations).toEqual([expectedViolation]);
        });
      });
    });
  });

  describe('when all types of packages and constraints are mixed together', () => {
    const pkgOne = {
      name: 'pkg-one',
      path: '/',
      version: '1.0.0',
      dependencies: [
        {
          name: 'pkg-two',
          version: '1.0.0',
          type: DependencyType.PRODUCTION,
        },
        {
          name: 'pkg-three',
          version: '1.0.0',
          type: DependencyType.PRODUCTION,
        },
        {
          name: 'pkg-four',
          version: '1.0.0',
          type: DependencyType.PRODUCTION,
        },
      ],
    } satisfies Package;
    const pkgTwo = {
      name: 'pkg-two',
      path: '/',
      version: '1.0.0',
      dependencies: [],
    } satisfies Package;
    const pkgThree = {
      name: 'pkg-three',
      path: '/',
      version: '1.0.0',
      dependencies: [
        {
          name: 'pkg-one',
          version: '1.0.0',
          type: DependencyType.PRODUCTION,
        },
      ],
    } satisfies Package;
    const pkgFour = {
      name: 'pkg-four',
      path: '/',
      version: '1.0.0',
      dependencies: [
        {
          name: 'pkg-six',
          version: '1.0.0',
          type: DependencyType.PRODUCTION,
        },
      ],
    } satisfies Package;
    const pkgFive = {
      name: 'pkg-five',
      path: '/',
      version: '1.0.0',
      dependencies: [],
    } satisfies Package;
    const pkgSix = {
      name: 'pkg-six',
      path: '/',
      version: '1.0.0',
      dependencies: [],
    } satisfies Package;

    const packages = [
      pkgOne,
      pkgTwo,
      pkgThree,
      pkgFour,
      pkgFive,
      pkgSix,
    ] satisfies Package[];

    const tagsData = [
      {
        packageName: pkgOne.name,
        tags: ['feature'],
      },
      {
        packageName: pkgTwo.name,
        tags: ['data'],
      },
      {
        packageName: pkgThree.name,
        tags: ['config'],
      },
      {
        packageName: pkgFour.name,
        tags: ['utility'],
      },
      {
        packageName: pkgFive.name,
        tags: ['config'],
      },
      {
        packageName: pkgSix.name,
        tags: ['not-allowed'],
      },
    ];

    const constraints = [
      { applyTo: 'feature', allow: '*' },
      { applyTo: 'data', allow: ['config'] },
      { applyTo: 'utility', allow: ['data'] },
      { applyTo: 'config', allow: ['config'] },
    ] satisfies ProjectConfig['constraints'];

    it('returns violations', async () => {
      const violations = await getViolationsData({
        packages,
        projectConfig: {
          constraints,
        },
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
        ])
      );
    });
  });
});
