import { Package, Violation } from '@commonalityco/types';
import { DependencyType } from '@commonalityco/utils-core';
import { getViolations } from './get-violations';

const basePkgOne = {
  path: '/pkgs/pkg-one',
  name: '@scope/pkg-one',
  description: 'A package',
  version: '1.0.0',
  tags: ['tag-one'],
  dependencies: [
    {
      name: '@scope/pkg-two',
      version: '1.0.0',
      type: DependencyType.PRODUCTION,
    },
  ],
  devDependencies: [],
  peerDependencies: [],
  owners: ['team-one'],
  docs: { readme: { filename: 'README.md', content: '' }, pages: [] },
};

const basePkgTwo = {
  path: '/pkgs/pkg-two',
  name: '@scope/pkg-two',
  description: 'A package',
  version: '1.0.0',
  tags: ['tag-two', 'tag-three'],
  dependencies: [],
  devDependencies: [],
  peerDependencies: [],
  owners: ['team-two'],
  docs: { readme: { filename: 'README.md', content: '' }, pages: [] },
};

describe('getViolations', () => {
  describe('when there are no constraints defined', () => {
    const packages = [basePkgOne, basePkgTwo];

    it('does not return violations', () => {
      const violations = getViolations({
        packages,
        projectConfig: {},
      });

      expect(violations).toEqual([]);
    });
  }),
    describe('when there are no packages that have tags', () => {
      const packages = [{ ...basePkgOne, tags: [] }];

      it('does not return violations', () => {
        const violations = getViolations({
          packages,
          projectConfig: {
            constraints: [{ tags: ['tag-one'], allow: ['tag-two'] }],
          },
        });

        expect(violations).toEqual([]);
      });
    });

  describe('when a package has tags', () => {
    describe('and there are no tags that match a constraint', () => {
      const packages = [basePkgOne];
      const constraints = [{ tags: ['tag-four'], allow: ['tag-five'] }];

      it('does not return violations', () => {
        const violations = getViolations({
          packages,
          projectConfig: {
            constraints,
          },
        });

        expect(violations).toEqual([]);
      });
    });

    describe('and it has tags that matches a constraint', () => {
      describe('and the constraint allows a wildcard', () => {
        const constraints = [
          { tags: ['tag-one'], allow: ['*'] },
          { tags: ['restricted'], allow: ['restricted'] },
        ];

        describe('and has a dependency that does not have any tags', () => {
          const packages = [
            basePkgOne,
            {
              ...basePkgTwo,
              tags: [],
            },
          ];

          it('does not return a violation', () => {
            const violations = getViolations({
              packages,
              projectConfig: {
                constraints,
              },
            });

            expect(violations).toEqual([]);
          });
        });

        describe('and has a dependency that does have tags', () => {
          const packages = [
            {...basePkgOne, tags:['tag-one', 'restricted']},
            {
              ...basePkgTwo,
              tags: ['foo'],
            },
          ];

          it('does not return a violation', () => {
            const violations = getViolations({
              packages,
              projectConfig: {
                constraints,
              },
            });

            expect(violations).toEqual([]);
          });
        });
      });

      describe('and the constraint allows specific tags', () => {
        describe('and has a dependency that does not have any tags', () => {
          const constraints = [{ tags: ['tag-one'], allow: ['tag-two'] }];
          const packages = [basePkgOne, { ...basePkgTwo, tags: [] }];

          it('returns violations', () => {
            const violations = getViolations({
              packages,
              projectConfig: {
                constraints,
              },
            });

            expect(violations).toEqual([
              {
                sourceName: '@scope/pkg-one',
                targetName: '@scope/pkg-two',
                matchTags: ['tag-one'],
                foundTags: [],
                disallowedTags: [],
                allowedTags: ['tag-two'],
              },
            ]);
          });
        });

        describe('and has a dependency that has tags that are not allowed by the constraint', () => {
          const constraints = [{ tags: ['tag-one'], allow: ['tag-two'] }];
          const packages = [basePkgOne, { ...basePkgTwo, tags: ['tag-three'] }];

          it('returns violations', () => {
            const violations = getViolations({
              packages,
              projectConfig: {
                constraints,
              },
            });

            expect(violations).toEqual([
              {
                sourceName: '@scope/pkg-one',
                targetName: '@scope/pkg-two',
                matchTags: ['tag-one'],
                foundTags: ['tag-three'],
                allowedTags: ['tag-two'],
                disallowedTags: [],
              },
            ]);
          });
        });

        describe('and has a dependency that has tags that are allowed by the constraint', () => {
          const constraints = [{ tags: ['tag-one'], allow: ['tag-two'] }];
          const packages = [basePkgOne, { ...basePkgTwo, tags: ['tag-two'] }];

          it('does not return a violation', () => {
            const violations = getViolations({
              packages,
              projectConfig: {
                constraints,
              },
            });

            expect(violations).toEqual([]);
          });
        });
      });
    });

    describe('and it has multiple tags that match multiple constraints', () => {
      const constraints = [
        { tags: ['tag-one', 'tag-five'], allow: ['tag-two'] },
        { tags: ['tag-two'], allow: ['tag-two'] },
        { tags: ['tag-five'], allow: ['tag-six'] },
      ];

      describe('and the package has a dependency that does not have any tags', () => {
        const packages = [basePkgOne, { ...basePkgTwo, tags: [] }];

        it('returns violations', () => {
          const violations = getViolations({
            packages,
            projectConfig: {
              constraints,
            },
          });

          expect(violations).toEqual([
            {
              allowedTags: ['tag-two'],
              disallowedTags: [],
              foundTags: [],
              matchTags: ['tag-one', 'tag-five'],
              sourceName: '@scope/pkg-one',
              targetName: '@scope/pkg-two',
            },
          ]);
        });
      });

      describe('and the package has a dependency that has tags that are not allowed by the constraint', () => {
        const packages = [basePkgOne, { ...basePkgTwo, tags: ['tag-three'] }];

        it('returns multiple violations', () => {
          const violations = getViolations({
            packages,
            projectConfig: {
              constraints,
            },
          });

          expect(violations).toEqual([
            {
              allowedTags: ['tag-two'],
              disallowedTags: [],
              foundTags: ['tag-three'],
              matchTags: ['tag-one', 'tag-five'],
              sourceName: '@scope/pkg-one',
              targetName: '@scope/pkg-two',
            },
          ]);
        });
      });

      describe('and the package has a dependency that has tags that are allowed by the constraint', () => {
        const packages = [basePkgOne, { ...basePkgTwo, tags: ['tag-two'] }];

        it('does not return violations', () => {
          const violations = getViolations({
            packages,
            projectConfig: {
              constraints,
            },
          });

          expect(violations).toEqual([]);
        });
      });
    });
  });

  it('should produce a violation when a dependency has a disallowed tag', () => {
    const projectConfig = {
      constraints: [{ tags: ['tag-one'], disallow: ['tag-two'] }],
    };
    const packages = [basePkgOne, basePkgTwo];
    const expectedViolation: Violation = {
      sourceName: '@scope/pkg-one',
      targetName: '@scope/pkg-two',
      matchTags: ['tag-one'],
      allowedTags: [],
      disallowedTags: ['tag-two'],
      foundTags: ['tag-two', 'tag-three'],
    };

    expect(
      getViolations({
        projectConfig,
        packages,
      })
    ).toEqual([expectedViolation]);
  });

  it('should produce a violation when a dependency has both an allowed tag and a disallowed tag', () => {
    const projectConfig = {
      constraints: [
        { tags: ['tag-one'], allow: ['tag-three'], disallow: ['tag-two'] },
      ],
    };
    const packages = [basePkgOne, basePkgTwo];
    const expectedViolation: Violation = {
      sourceName: '@scope/pkg-one',
      targetName: '@scope/pkg-two',
      matchTags: ['tag-one'],
      allowedTags: [],
      disallowedTags: ['tag-two'],
      foundTags: ['tag-two', 'tag-three'],
    };

    expect(
      getViolations({
        projectConfig,
        packages,
      })
    ).toEqual([expectedViolation]);
  });

  it('should produce a violation when an indirect dependency has a disallowed tag', () => {
    const projectConfig = {
      constraints: [
        { tags: ['tag-one'], allow: ['tag-two'], disallow: ['tag-four'] },
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
        tags: ['tag-four'],
        path: '/',
        version: '1.0.0',
        docs: { readme: { filename: '', content: '' }, pages: [] },
        dependencies: [],
        devDependencies: [],
        peerDependencies: [],
      },
    ];
    const expectedViolation: Violation = {
      sourceName: '@scope/pkg-one',
      targetName: '@scope/pkg-three',
      matchTags: ['tag-one'],
      allowedTags: [],
      disallowedTags: ['tag-four'],
      foundTags: ['tag-four'],
    };

    expect(
      getViolations({
        projectConfig,
        packages,
      })
    ).toEqual([expectedViolation]);
  });

  describe('when all types of packages and constraints are mixed together', () => {
    const packages = [
      {
        name: 'pkg-one',
        tags: ['feature'],
        path: '/',
        version: '1.0.0',
        docs: { readme: { filename: '', content: '' }, pages: [] },
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
      },
      {
        name: 'pkg-two',
        tags: ['data'],
        path: '/',
        version: '1.0.0',
        docs: { readme: { filename: '', content: '' }, pages: [] },
        dependencies: [],
        devDependencies: [],
        peerDependencies: [],
      },
      {
        name: 'pkg-three',
        tags: ['config'],
        path: '/',
        version: '1.0.0',
        docs: { readme: { filename: '', content: '' }, pages: [] },
        dependencies: [
          {
            name: 'pkg-one',
            version: '1.0.0',
            type: DependencyType.PRODUCTION,
          },
        ],
        devDependencies: [],
        peerDependencies: [],
      },
      {
        name: 'pkg-four',
        tags: ['utility'],
        path: '/',
        version: '1.0.0',
        docs: { readme: { filename: '', content: '' }, pages: [] },
        dependencies: [
          {
            name: 'pkg-six',
            version: '1.0.0',
            type: DependencyType.PRODUCTION,
          },
        ],
        devDependencies: [],
        peerDependencies: [],
      },
      {
        name: 'pkg-five',
        tags: ['config'],
        path: '/',
        version: '1.0.0',
        docs: { readme: { filename: '', content: '' }, pages: [] },
        dependencies: [],
        devDependencies: [],
        peerDependencies: [],
      },
      {
        name: 'pkg-six',
        tags: ['not-allowed'],
        path: '/',
        version: '1.0.0',
        docs: { readme: { filename: '', content: '' }, pages: [] },
        dependencies: [],
        devDependencies: [],
        peerDependencies: [],
      },
    ] satisfies Package[];

    const constraints = [
      { tags: ['feature'], allow: ['*'] },
      { tags: ['data'], allow: ['config'] },
      { tags: ['utility'], allow: ['data'] },
      { tags: ['config'], allow: ['config'] },
    ];

    it('returns violations', () => {
      const violations = getViolations({
        packages,
        projectConfig: {
          constraints,
        },
      });

      expect(violations).toEqual(
        expect.arrayContaining([
          {
            sourceName: 'pkg-four',
            targetName: 'pkg-six',
            matchTags: ['utility'],
            foundTags: ['not-allowed'],
            allowedTags: ['data'],
            disallowedTags: [],
          },
          {
            sourceName: 'pkg-three',
            targetName: 'pkg-one',
            matchTags: ['config'],
            foundTags: ['feature'],
            allowedTags: ['config'],
            disallowedTags: [],
          },
        ])
      );
    });
  });
});
