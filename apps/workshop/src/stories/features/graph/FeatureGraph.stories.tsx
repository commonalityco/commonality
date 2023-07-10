import type { Meta, StoryObj } from '@storybook/react';
import { FeatureGraph, FeatureGraphLayout } from '@commonalityco/feature-graph';
import { getUpdatedGraphJson } from '@commonalityco/utils-graph';
import { DependencyType, PackageManager } from '@commonalityco/utils-core';
import {
  CodeownersData,
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
    getUpdatedGraphJson,
    onSetTags: () => Promise.resolve(),
    violations: [],
    getTags: () =>
      Promise.resolve([{ packageName: 'pkg-one', tags: ['tag-one'] }]),
    projectConfig: {},
  },
  decorators: [
    (Story, props) => {
      return (
        <div style={{ height: '600px', width: '100%' }}>
          <FeatureGraphLayout dehydratedState={{ queries: [], mutations: [] }}>
            <Story {...props} />
          </FeatureGraphLayout>
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

  dependencies: [
    {
      name: '@scope/pkg-b',
      version: '1.0.0',
      type: DependencyType.PRODUCTION,
    },
    {
      name: '@scope/pkg-c',
      version: '1.0.0',
      type: DependencyType.DEVELOPMENT,
    },
    { name: '@scope/pkg-d', version: '1.0.0', type: DependencyType.PEER },
    { name: '@scope/pkg-e', version: '1.0.0', type: DependencyType.PEER },
  ],
  devDependencies: [],
  peerDependencies: [],
} satisfies Package;

const pkgTwo = {
  name: '@scope/pkg-b',
  path: 'packages/pkg-b',
  version: '1.0.0',
  description: 'This is package B',
  dependencies: [],
  devDependencies: [],
  peerDependencies: [],
} satisfies Package;

const pkgThree = {
  name: '@scope/pkg-c',
  path: 'packages/pkg-c',
  version: '1.0.0',
  description: 'This is package C',
  dependencies: [],
  devDependencies: [],
  peerDependencies: [],
} satisfies Package;

const pkgFour = {
  name: '@scope/pkg-d',
  path: 'packages/pkg-d',
  version: '1.0.0',
  description: 'This is package D',
  dependencies: [],
  devDependencies: [],
  peerDependencies: [],
} satisfies Package;

const pkgFive = {
  name: '@scope/pkg-e',
  path: 'packages/pkg-e',
  version: '1.0.0',
  description: 'This is package E',
  dependencies: [],
  devDependencies: [],
  peerDependencies: [],
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
] as CodeownersData[];

const packages = [pkgOne, pkgTwo, pkgThree, pkgFour, pkgFive];

export const Default: Story = {
  args: {
    packages,
    codeownersData,
    documentsData: [],
    getViolations: () => Promise.resolve([]),
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
    packages,
    codeownersData,
    documentsData: [],
    projectConfig: {
      constraints: [
        {
          applyTo: 'foo',
          allow: ['bar'],
          disallow: ['baz'],
        },
      ],
    } satisfies ProjectConfig,
    violations,
    getViolations: () => Promise.resolve(violations),
  },
};
