import type { Meta, StoryObj } from '@storybook/react';
import { FeatureGraph, FeatureGraphLayout } from '@commonalityco/feature-graph';
import { getUpdatedGraphJson } from '@commonalityco/utils-graph';
import { DependencyType, PackageManager } from '@commonalityco/utils-core';

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

const packages = [
  {
    name: '@scope/pkg-a',
    path: 'packages/pkg-a',
    version: '1.0.0',
    description: 'This is package A',
    tags: ['tag1', 'tag2'],
    owners: ['@scope/owner1', '@scope/owner2'],
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
    docs: {
      readme: {
        filename: 'README.md',
        content: '# This is a readme',
      },
      pages: [],
    },
  },
  {
    name: '@scope/pkg-b',
    path: 'packages/pkg-b',
    version: '1.0.0',
    description: 'This is package B',
    tags: ['tag1', 'tag2'],
    owners: ['@scope/owner1', '@scope/owner2'],
    dependencies: [],
    devDependencies: [],
    peerDependencies: [],
    docs: {
      readme: {
        filename: 'README.md',
        content: '# This is a readme',
      },
      pages: [],
    },
  },
  {
    name: '@scope/pkg-c',
    path: 'packages/pkg-c',
    version: '1.0.0',
    description: 'This is package C',
    tags: ['tag1', 'tag2'],
    owners: ['@scope/owner1', '@scope/owner2'],
    dependencies: [],
    devDependencies: [],
    peerDependencies: [],
    docs: {
      readme: {
        filename: 'README.md',
        content: '# This is a readme',
      },
      pages: [],
    },
  },
  {
    name: '@scope/pkg-d',
    path: 'packages/pkg-d',
    version: '1.0.0',
    description: 'This is package D',
    tags: ['tag1', 'tag2'],
    owners: ['@scope/owner1', '@scope/owner2'],
    dependencies: [],
    devDependencies: [],
    peerDependencies: [],
    docs: {
      readme: {
        filename: 'README.md',
        content: '# This is a readme',
      },
      pages: [],
    },
  },
  {
    name: '@scope/pkg-e',
    path: 'packages/pkg-e',
    version: '1.0.0',
    description: 'This is package E',
    tags: ['tag1', 'tag2'],
    owners: ['@scope/owner1', '@scope/owner2'],
    dependencies: [],
    devDependencies: [],
    peerDependencies: [],
    docs: {
      readme: {
        filename: 'README.md',
        content: '# This is a readme',
      },
      pages: [],
    },
  },
];

export const Default: Story = {
  args: {
    packages,
  },
};

export const ConstraintsAndViolations: Story = {
  args: {
    packages,
    projectConfig: {
      constraints: [
        {
          tag: 'foo',
          allow: ['bar'],
          disallow: ['baz'],
        },
      ],
    },
    violations: [
      {
        sourcePackageName: '@scope/pkg-a',
        targetPackageName: '@scope/pkg-b',
        constraintTag: 'foo',
        allowedTags: ['bar'],
        disallowedTags: ['baz'],
        foundTags: ['tag1', 'tag2'],
      },
    ],
  },
};
