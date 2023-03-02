import { ProjectConfig, Package, DependencyType } from '@commonalityco/types';
import { getConstraintViolations } from './get-constraint-violations';

describe('getConstraintViolations', () => {
  describe('when a dependency does contain the allowed tags', () => {
    const packages: Package[] = [
      {
        name: '@scope/one',
        version: '1.0.0',
        path: 'packages/one',
        tags: ['tag-one'],
        owners: [],
        dependencies: [
          {
            name: '@scope/two',
            type: DependencyType.PRODUCTION,
            version: '*',
          },
        ],
        devDependencies: [],
        peerDependencies: [],
      },
      {
        name: '@scope/two',
        version: '1.0.0',
        path: 'packages/two',
        owners: [],
        tags: ['tag-two'],
        dependencies: [
          {
            name: '@scope/three',
            version: '*',
            type: DependencyType.PRODUCTION,
          },
        ],
        devDependencies: [],
        peerDependencies: [],
      },
      {
        name: '@scope/three',
        version: '1.0.0',
        path: 'packages/three',
        owners: [],
        tags: ['tag-three'],
        dependencies: [],
        devDependencies: [],
        peerDependencies: [],
      },
    ];

    const config: ProjectConfig = {
      projectId: '123',
      constraints: [
        {
          tags: ['tag-one'],
          allow: ['tag-two'],
        },
        {
          tags: ['tag-two'],
          allow: ['tag-three'],
        },
      ],
    };

    it('returns no violations', async () => {
      const violations = getConstraintViolations({ packages, config });
      expect(violations).toEqual([]);
    });
  });

  describe('when a dependency does not contain the allowed tags', () => {
    const packages: Package[] = [
      {
        name: '@scope/one',
        version: '1.0.0',
        path: 'packages/one',
        tags: ['tag-one'],
        owners: [],
        dependencies: [
          {
            name: '@scope/two',
            version: '*',
            type: DependencyType.PRODUCTION,
          },
        ],
        devDependencies: [
          {
            name: '@scope/three',
            version: '*',
            type: DependencyType.PRODUCTION,
          },
        ],
        peerDependencies: [],
      },
      {
        name: '@scope/two',
        version: '1.0.0',
        path: 'packages/two',
        owners: [],
        tags: ['tag-two'],
        dependencies: [],
        devDependencies: [
          {
            name: '@scope/three',
            version: '*',
            type: DependencyType.PRODUCTION,
          },
        ],
        peerDependencies: [],
      },
      {
        name: '@scope/three',
        version: '1.0.0',
        path: 'packages/three',
        owners: [],
        tags: [],
        dependencies: [
          {
            name: '@scope/one',
            version: '*',
            type: DependencyType.PRODUCTION,
          },
        ],
        devDependencies: [],
        peerDependencies: [],
      },
    ];

    const config: ProjectConfig = {
      projectId: '123',
      constraints: [
        {
          tags: ['tag-one'],
          allow: ['tag-two'],
        },
      ],
    };

    it('returns violations', async () => {
      const violations = getConstraintViolations({ packages, config });

      expect(violations).toEqual([
        {
          constraintTags: ['tag-one'],
          allowedTags: ['tag-two'],
          sourceName: '@scope/one',
          targetName: '@scope/three',
          targetTags: [],
          path: 'packages/one',
        },
        {
          constraintTags: ['tag-one'],
          allowedTags: ['tag-two'],
          sourceName: '@scope/two',
          targetName: '@scope/three',
          targetTags: [],
          path: 'packages/two',
        },
        {
          constraintTags: ['tag-one'],
          allowedTags: ['tag-two'],
          sourceName: '@scope/three',
          targetName: '@scope/one',
          targetTags: ['tag-one'],
          path: 'packages/three',
        },
      ]);
    });
  });

  describe('when a dependency does not have tags defined', () => {
    const packages: Package[] = [
      {
        name: '@scope/one',
        owners: [],
        version: '1.0.0',
        path: 'packages/one',
        tags: ['tag-one'],
        dependencies: [
          {
            name: '@scope/two',
            version: '*',
            type: DependencyType.PRODUCTION,
          },
        ],
        devDependencies: [],
        peerDependencies: [],
      },
      {
        name: '@scope/two',
        owners: [],
        version: '1.0.0',
        path: 'packages/two',
        tags: [],
        dependencies: [],
        devDependencies: [],
        peerDependencies: [],
      },
    ];

    const config: ProjectConfig = {
      projectId: '123',
      constraints: [
        {
          tags: ['tag-one'],
          allow: ['tag-two'],
        },
      ],
    };

    it('returns a violation within the array', async () => {
      const violations = getConstraintViolations({ packages, config });

      expect(violations).toEqual([
        {
          constraintTags: ['tag-one'],
          allowedTags: ['tag-two'],
          sourceName: '@scope/one',
          targetName: '@scope/two',
          path: 'packages/one',
          targetTags: [],
        },
      ]);
    });
  });

  describe('when there are no constraints defined', () => {
    const packages: Package[] = [
      {
        name: '@scope/one',
        owners: [],
        version: '1.0.0',
        path: 'packages/one',
        tags: ['tag-one'],
        dependencies: [
          {
            name: '@scope/two',
            version: '*',
            type: DependencyType.PRODUCTION,
          },
        ],
        devDependencies: [],
        peerDependencies: [],
      },
      {
        name: '@scope/two',
        owners: [],
        version: '1.0.0',
        path: 'packages/two',
        tags: [],
        dependencies: [],
        devDependencies: [],
        peerDependencies: [],
      },
    ];

    const config: ProjectConfig = {
      projectId: '123',
    };

    it('returns no violations', async () => {
      const violations = getConstraintViolations({ packages, config });

      expect(violations).toEqual([]);
    });
  });
});
