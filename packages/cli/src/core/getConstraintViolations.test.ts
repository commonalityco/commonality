describe('getConstraintViolations', () => {
  it.skip('returns no violations', () => {
    console.log();
  });
  // describe('when a dependency does contain the allowed tags', () => {
  //   const packages: LocalPackage[] = [
  //     {
  //       name: '@scope/foo',
  //       version: '1.0.0',
  //       path: 'packages/foo',
  //       tags: ['tag-one'],
  //       dependencies: [
  //         {
  //           name: '@scope/bar',
  //           version: '*',
  //         },
  //       ],
  //       devDependencies: [],
  //       peerDependencies: [],
  //     },
  //     {
  //       name: '@scope/bar',
  //       version: '1.0.0',
  //       path: 'packages/bar',
  //       tags: ['tag-two'],
  //       dependencies: [],
  //       devDependencies: [],
  //       peerDependencies: [],
  //     },
  //   ];
  //   const config: Config = {
  //     project: '123',
  //     constraints: [
  //       {
  //         tags: ['tag-one'],
  //         allow: ['tag-two'],
  //       },
  //     ],
  //   };
  //   it('returns no violations', async () => {
  //     const violations = getConstraintViolations(packages, config);
  //     expect(violations).toEqual([]);
  //   });
  // });
  // describe('when a dependency does not contain the allowed tags', () => {
  //   const packages: LocalPackage[] = [
  //     {
  //       name: '@scope/foo',
  //       version: '1.0.0',
  //       path: 'packages/foo',
  //       tags: ['tag-one'],
  //       dependencies: [
  //         {
  //           name: '@scope/bar',
  //           version: '*',
  //         },
  //       ],
  //       devDependencies: [],
  //       peerDependencies: [],
  //     },
  //     {
  //       name: '@scope/bar',
  //       version: '1.0.0',
  //       path: 'packages/bar',
  //       tags: ['tag-three'],
  //       dependencies: [],
  //       devDependencies: [],
  //       peerDependencies: [],
  //     },
  //   ];
  //   const config: Config = {
  //     project: '123',
  //     constraints: [
  //       {
  //         tags: ['tag-one'],
  //         allow: ['tag-two'],
  //       },
  //     ],
  //   };
  //   it('returns a violation within the array', async () => {
  //     const violations = getConstraintViolations(packages, config);
  //     expect(violations).toEqual([
  //       {
  //         constraintTags: ['tag-one'],
  //         allowedTags: ['tag-two'],
  //         sourceName: '@scope/foo',
  //         targetName: '@scope/bar',
  //         targetTags: ['tag-three'],
  //         path: 'packages/foo',
  //       },
  //     ]);
  //   });
  // });
  // describe('when a dependency does not have tags defined', () => {
  //   const packages: LocalPackage[] = [
  //     {
  //       name: '@scope/foo',
  //       version: '1.0.0',
  //       path: 'packages/foo',
  //       tags: ['tag-one'],
  //       dependencies: [
  //         {
  //           name: '@scope/bar',
  //           version: '*',
  //         },
  //       ],
  //       devDependencies: [],
  //       peerDependencies: [],
  //     },
  //     {
  //       name: '@scope/bar',
  //       version: '1.0.0',
  //       path: 'packages/bar',
  //       tags: [],
  //       dependencies: [],
  //       devDependencies: [],
  //       peerDependencies: [],
  //     },
  //   ];
  //   const config: Config = {
  //     project: '123',
  //     constraints: [
  //       {
  //         tags: ['tag-one'],
  //         allow: ['tag-two'],
  //       },
  //     ],
  //   };
  //   it('returns a violation within the array', async () => {
  //     const violations = getConstraintViolations(packages, config);
  //     expect(violations).toEqual([
  //       {
  //         constraintTags: ['tag-one'],
  //         allowedTags: ['tag-two'],
  //         sourceName: '@scope/foo',
  //         targetName: '@scope/bar',
  //         path: 'packages/foo',
  //         targetTags: [],
  //       },
  //     ]);
  //   });
  // });
  // describe('when there are no constraints defined', () => {
  //   const packages: LocalPackage[] = [
  //     {
  //       name: '@scope/foo',
  //       version: '1.0.0',
  //       path: 'packages/foo',
  //       tags: ['tag-one'],
  //       dependencies: [
  //         {
  //           name: '@scope/bar',
  //           version: '*',
  //         },
  //       ],
  //       devDependencies: [],
  //       peerDependencies: [],
  //     },
  //     {
  //       name: '@scope/bar',
  //       version: '1.0.0',
  //       path: 'packages/bar',
  //       tags: [],
  //       dependencies: [],
  //       devDependencies: [],
  //       peerDependencies: [],
  //     },
  //   ];
  //   const config: Config = {
  //     project: '123',
  //   };
  //   it('returns no violations', async () => {
  //     const violations = getConstraintViolations(packages, config);
  //     expect(violations).toEqual([]);
  //   });
  // });
});
