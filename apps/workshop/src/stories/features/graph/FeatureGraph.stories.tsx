import type { Meta, StoryObj } from '@storybook/react';
import {
  FeatureGraph,
  FeatureGraphLayout,
  GraphProvider,
} from '@commonalityco/feature-graph';
import {
  documentsKeys,
  getElementDefinitionsWithUpdatedLayout,
} from '@commonalityco/utils-graph';
import {
  DependencyType,
  PackageManager,
  PackageType,
} from '@commonalityco/utils-core';
import {
  CodeownersData,
  Constraint,
  Dependency,
  DocumentsData,
  Package,
  ProjectConfig,
  TagsData,
  Violation,
} from '@commonalityco/types';

const meta = {
  title: 'Features/Graph/FeatureGraph',
  component: FeatureGraph,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    packageManager: PackageManager.PNPM,
    theme: 'light',
    getViolations: () => Promise.resolve([]),
  },
  decorators: [
    (Story, props) => {
      return (
        <div style={{ height: '600px', width: '100%' }}>
          <GraphProvider dehydratedState={{ queries: [], mutations: [] }}>
            <FeatureGraphLayout>
              <Story {...props} />
            </FeatureGraphLayout>
          </GraphProvider>
        </div>
      );
    },
  ],
} satisfies Meta<typeof FeatureGraph>;

export default meta;
type Story = StoryObj<typeof meta>;

const pkgOne = {
  name: '@scope/pkg-a',
  path: 'packages/pkg-a',
  version: '1.0.0',
  description: 'This is package A',
  type: PackageType.NODE,
} satisfies Package;

const pkgTwo = {
  name: '@scope/pkg-b',
  path: 'packages/pkg-b',
  version: '1.0.0',
  description: 'This is package B',
  type: PackageType.NODE,
} satisfies Package;

const pkgThree = {
  name: '@scope/pkg-c',
  path: 'packages/pkg-c',
  version: '1.0.0',
  description: 'This is package C',
  type: PackageType.NODE,
} satisfies Package;

const pkgFour = {
  name: '@scope/pkg-d',
  path: 'packages/pkg-d',
  version: '1.0.0',
  description: 'This is package D',
  type: PackageType.NODE,
} satisfies Package;

const pkgFive = {
  name: '@scope/pkg-e',
  path: 'packages/pkg-e',
  version: '1.0.0',
  description: 'This is package E',
  type: PackageType.NODE,
} satisfies Package;

const tagData = [
  {
    packageName: pkgOne.name,
    tags: ['tag1', 'tag2'],
  },
  {
    packageName: pkgTwo.name,
    tags: ['tag1', 'tag2'],
  },
  {
    packageName: pkgThree.name,
    tags: ['tag1', 'tag2'],
  },
  {
    packageName: pkgFour.name,
    tags: ['tag1', 'tag2'],
  },
  {
    packageName: pkgFive.name,
    tags: ['tag1', 'tag2'],
  },
] as TagsData[];

const codeownersData = [
  {
    packageName: pkgOne.name,
    codeowners: ['@team-one', '@team-two'],
  },
  {
    packageName: pkgTwo.name,
    codeowners: ['@team-one', '@team-two'],
  },
  {
    packageName: pkgThree.name,
    codeowners: ['@team-one', '@team-two'],
  },
  {
    packageName: pkgFour.name,
    codeowners: ['@team-one', '@team-two'],
  },
  {
    packageName: pkgFive.name,
    codeowners: ['@team-one', '@team-two'],
  },
] satisfies CodeownersData[];

const packages = [
  pkgOne,
  pkgTwo,
  pkgThree,
  pkgFour,
  pkgFive,
] satisfies Package[];

const dependencies = [
  {
    type: DependencyType.PRODUCTION,
    version: '1.0.0',
    source: '@scope/pkg-a',
    target: '@scope/pkg-b',
  },
  {
    type: DependencyType.DEVELOPMENT,
    version: '1.0.0',
    source: '@scope/pkg-a',
    target: '@scope/pkg-c',
  },
  {
    type: DependencyType.PEER,
    version: '1.0.0',
    source: '@scope/pkg-a',
    target: '@scope/pkg-d',
  },
  {
    type: DependencyType.PEER,
    version: '1.0.0',
    source: '@scope/pkg-a',
    target: '@scope/pkg-e',
  },
] satisfies Dependency[];

export const Default: Story = {
  args: {
    getPackages: () => Promise.resolve(packages),
    getDependencies: () => Promise.resolve(dependencies),
    getViolations: () => Promise.resolve([]),
    getConstraints: () => Promise.resolve([]),
  },
};

const violations = [
  {
    sourcePackageName: '@scope/pkg-a',
    targetPackageName: '@scope/pkg-b',
    appliedTo: 'foo',
    allowed: ['bar'],
    disallowed: ['baz'],
    found: ['tag1', 'tag2'],
  },
] satisfies Violation[];

export const ConstraintsAndViolations: Story = {
  args: {
    getPackages: () => Promise.resolve(packages),
    getDependencies: () => Promise.resolve(dependencies),
    getConstraints: () =>
      Promise.resolve([
        {
          applyTo: 'foo',
          allow: ['bar'],
          disallow: ['baz'],
        },
      ] satisfies Constraint[]),

    getViolations: () => Promise.resolve(violations),
  },
};

export const Zero: Story = {
  args: {
    getPackages: () => Promise.resolve([]),
    getDependencies: () => Promise.resolve([]),
    getConstraints: () => Promise.resolve([]),
    getViolations: () => Promise.resolve([]),
  },
};
