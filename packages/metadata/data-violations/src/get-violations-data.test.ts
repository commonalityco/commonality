import {
  CodeownersData,
  Package,
  TagsData,
  Violation,
} from '@commonalityco/types';
import { DependencyType } from '@commonalityco/utils-core';
import { getViolationsData } from './get-violations-data';

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
  devDependencies: [],
  peerDependencies: [],
} satisfies Package;

const basePkgTwo = {
  path: '/pkgs/pkg-two',
  name: '@scope/pkg-two',
  description: 'A package',
  version: '1.0.0',
  dependencies: [],
  devDependencies: [],
  peerDependencies: [],
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
        tagData: baseTagsData,
      });

      expect(violations).toEqual([]);
    });
  }),
    describe('when there are no packages that have tags', () => {
      const packages = [{ ...basePkgOne, tags: [] }];
      const tagData = [] satisfies TagsData[];

      it('does not return violations', async () => {
        const violations = await getViolationsData({
          packages,
          projectConfig: {
            constraints: [{ tag: 'tag-one', allow: ['tag-two'] }],
          },
          tagData,
        });

        expect(violations).toEqual([]);
      });
    });

  describe('when a package has tags', () => {
    describe('and there are no tags that match a constraint', () => {
      const packages = [basePkgOne];
      const tagData = [
        { packageName: basePkgOne.name, tags: ['tag-one'] },
      ] satisfies TagsData[];
      const constraints = [{ tag: 'tag-four', allow: ['tag-five'] }];

      it('does not return violations', async () => {
        const violations = await getViolationsData({
          packages,
          projectConfig: {
            constraints,
          },
          tagData,
        });

        expect(violations).toEqual([]);
      });
    });

    describe('and it has tags that matches a constraint', () => {
      describe('and the constraint allows a wildcard', () => {
        const constraints = [
          { tag: 'tag-one', allow: ['*'] },
          { tag: 'restricted', allow: ['restricted'] },
        ];

        describe('and has a dependency that does not have any tags', () => {
          const tagData = [
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
              tagData,
            });

            expect(violations).toEqual([]);
          });
        });

        describe('and has a dependency that does have tags', () => {
          const tagData = [
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
              tagData,
            });

            expect(violations).toEqual([]);
          });
        });
      });

      describe('and the constraint allows specific tags', () => {
        describe('and has a dependency that does not have any tags', () => {
          const constraints = [{ tag: 'tag-one', allow: ['tag-two'] }];
          const tagData = [
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
              tagData,
            });

            expect(violations).toEqual([
              {
                sourcePackageName: '@scope/pkg-one',
                targetPackageName: '@scope/pkg-two',
                constraintTag: 'tag-one',
                foundTags: [],
                disallowedTags: [],
                allowedTags: ['tag-two'],
              },
            ]);
          });
        });

        describe('and has a dependency that has tags that are not allowed by the constraint', () => {
          const constraints = [{ tag: 'tag-one', allow: ['tag-two'] }];
          const tagData = [
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
              tagData,
            });

            expect(violations).toEqual([
              {
                sourcePackageName: '@scope/pkg-one',
                targetPackageName: '@scope/pkg-two',
                constraintTag: 'tag-one',
                foundTags: ['tag-three'],
                allowedTags: ['tag-two'],
                disallowedTags: [],
              },
            ]);
          });
        });

        describe('and has a dependency that has tags that are allowed by the constraint', () => {
          const constraints = [{ tag: 'tag-one', allow: ['tag-two'] }];
          const tagData = [
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
              tagData,
            });

            expect(violations).toEqual([]);
          });
        });
      });
    });

    describe('and it has multiple tags that match multiple constraints', () => {
      const constraints = [
        { tag: 'tag-one', allow: ['tag-two'] },
        { tag: 'tag-five', allow: ['tag-two'] },
        { tag: 'tag-two', allow: ['tag-two'] },
        { tag: 'tag-five', allow: ['tag-six'] },
      ];

      describe('and the package has a dependency that does not have any tags', () => {
        const tagData = [
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
            tagData,
          });

          expect(violations).toEqual(
            expect.arrayContaining([
              {
                allowedTags: ['tag-two'],
                disallowedTags: [],
                foundTags: [],
                constraintTag: 'tag-one',
                sourcePackageName: '@scope/pkg-one',
                targetPackageName: '@scope/pkg-two',
              },
              {
                allowedTags: ['tag-six'],
                disallowedTags: [],
                foundTags: [],
                constraintTag: 'tag-five',
                sourcePackageName: '@scope/pkg-one',
                targetPackageName: '@scope/pkg-two',
              },
            ])
          );
        });
      });

      describe('and the package has a dependency that has tags that are not allowed by the constraint', () => {
        const packages = [basePkgOne, basePkgTwo] satisfies Package[];
        const tagData = [
          { packageName: basePkgOne.name, tags: ['tag-one', 'tag-five'] },
          { packageName: basePkgTwo.name, tags: ['tag-two', 'tag-three'] },
        ] satisfies TagsData[];

        it('returns multiple violations', async () => {
          const violations = await getViolationsData({
            packages,
            projectConfig: {
              constraints,
            },
            tagData,
          });

          expect(violations).toEqual(
            expect.arrayContaining([
              {
                allowedTags: ['tag-six'],
                disallowedTags: [],
                foundTags: ['tag-two', 'tag-three'],
                constraintTag: 'tag-five',
                sourcePackageName: '@scope/pkg-one',
                targetPackageName: '@scope/pkg-two',
              },
            ])
          );
        });
      });

      describe('and the package has a dependency that has tags that are allowed by the constraint', () => {
        const packages = [basePkgOne, basePkgTwo] satisfies Package[];
        const tagData = [
          { packageName: basePkgOne.name, tags: ['tag-one'] },
          { packageName: basePkgTwo.name, tags: ['tag-two'] },
        ] satisfies TagsData[];

        it('does not return violations', async () => {
          const violations = await getViolationsData({
            packages,
            projectConfig: {
              constraints,
            },
            tagData,
          });

          expect(violations).toEqual([]);
        });
      });
    });
  });

  it('should produce a violation when a dependency has a disallowed tag', async () => {
    const projectConfig = {
      constraints: [{ tag: 'tag-one', disallow: ['tag-two'] }],
    };
    const packages = [basePkgOne, basePkgTwo] satisfies Package[];
    const tagData = [
      { packageName: basePkgOne.name, tags: ['tag-one'] },
      { packageName: basePkgTwo.name, tags: ['tag-two', 'tag-three'] },
    ] satisfies TagsData[];

    const expectedViolation = {
      sourcePackageName: '@scope/pkg-one',
      targetPackageName: '@scope/pkg-two',
      constraintTag: 'tag-one',
      allowedTags: [],
      disallowedTags: ['tag-two'],
      foundTags: ['tag-two', 'tag-three'],
    } satisfies Violation;

    const violations = await getViolationsData({
      projectConfig,
      packages,
      tagData,
    });

    expect(violations).toEqual([expectedViolation]);
  });

  it('should produce a violation when a dependency has both an allowed tag and a disallowed tag', async () => {
    const projectConfig = {
      constraints: [
        { tag: 'tag-one', allow: ['tag-three'], disallow: ['tag-two'] },
      ],
    };

    const expectedViolation: Violation = {
      sourcePackageName: '@scope/pkg-one',
      targetPackageName: '@scope/pkg-two',
      constraintTag: 'tag-one',
      allowedTags: [],
      disallowedTags: ['tag-two'],
      foundTags: ['tag-two', 'tag-three'],
    };

    const packages = [basePkgOne, basePkgTwo] satisfies Package[];
    const tagData = [
      { packageName: basePkgOne.name, tags: ['tag-one'] },
      { packageName: basePkgTwo.name, tags: ['tag-two', 'tag-three'] },
    ] satisfies TagsData[];

    const violations = await getViolationsData({
      projectConfig,
      packages,
      tagData,
    });

    expect(violations).toEqual([expectedViolation]);
  });

  it('should produce a violation when an indirect dependency has a disallowed tag', async () => {
    const projectConfig = {
      constraints: [
        { tag: 'tag-one', allow: ['tag-two'], disallow: ['tag-four'] },
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
        devDependencies: [],
        peerDependencies: [],
      },
    ] satisfies Package[];
    const tagData = [
      { packageName: basePkgOne.name, tags: ['tag-one'] },
      { packageName: basePkgTwo.name, tags: ['tag-two', 'tag-three'] },
      { packageName: '@scope/pkg-three', tags: ['tag-four'] },
    ] satisfies TagsData[];

    const expectedViolation: Violation = {
      sourcePackageName: '@scope/pkg-one',
      targetPackageName: '@scope/pkg-three',
      constraintTag: 'tag-one',
      allowedTags: [],
      disallowedTags: ['tag-four'],
      foundTags: ['tag-four'],
    };

    const violations = await getViolationsData({
      projectConfig,
      packages,
      tagData,
    });

    expect(violations).toEqual([expectedViolation]);
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
      devDependencies: [],
      peerDependencies: [],
    } satisfies Package;
    const pkgTwo = {
      name: 'pkg-two',
      path: '/',
      version: '1.0.0',
      dependencies: [],
      devDependencies: [],
      peerDependencies: [],
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
      devDependencies: [],
      peerDependencies: [],
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
      devDependencies: [],
      peerDependencies: [],
    } satisfies Package;
    const pkgFive = {
      name: 'pkg-five',
      path: '/',
      version: '1.0.0',
      dependencies: [],
      devDependencies: [],
      peerDependencies: [],
    } satisfies Package;
    const pkgSix = {
      name: 'pkg-six',
      path: '/',
      version: '1.0.0',
      dependencies: [],
      devDependencies: [],
      peerDependencies: [],
    } satisfies Package;

    const packages = [
      pkgOne,
      pkgTwo,
      pkgThree,
      pkgFour,
      pkgFive,
      pkgSix,
    ] satisfies Package[];

    const tagData = [
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
      { tag: 'feature', allow: ['*'] },
      { tag: 'data', allow: ['config'] },
      { tag: 'utility', allow: ['data'] },
      { tag: 'config', allow: ['config'] },
    ];

    it('returns violations', async () => {
      const violations = await getViolationsData({
        packages,
        projectConfig: {
          constraints,
        },
        tagData,
      });

      expect(violations).toEqual(
        expect.arrayContaining([
          {
            sourcePackageName: 'pkg-four',
            targetPackageName: 'pkg-six',
            constraintTag: 'utility',
            foundTags: ['not-allowed'],
            allowedTags: ['data'],
            disallowedTags: [],
          },
          {
            sourcePackageName: 'pkg-three',
            targetPackageName: 'pkg-one',
            constraintTag: 'config',
            foundTags: ['feature'],
            allowedTags: ['config'],
            disallowedTags: [],
          },
        ])
      );
    });
  });
});
