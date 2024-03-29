import { Meta, StoryObj } from '@storybook/react';
import { DependencyType, PackageType } from '@commonalityco/utils-core';
import { Dependency, Package } from '@commonalityco/types';
import { getEdges, getNodes, Graph } from '@commonalityco/feature-graph';

const meta: Meta<typeof Graph> = {
  title: 'Graph',
  component: Graph,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  args: {},
  decorators: [
    (Story) => (
      <div style={{ height: '100vh' }}>
        <Story />
      </div>
    ),
  ],
};

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
    type: DependencyType.DEVELOPMENT,
    version: '1.0.0',
    source: '@scope/pkg-d',
    target: '@scope/pkg-',
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

export const Default = {
  args: {
    nodes: getNodes({
      packages,
      dependencies,
      tagsData: [{ packageName: '@scope/pkg-a', tags: ['tag-a', 'tag-b'] }],
    }),
    edges: getEdges({
      dependencies,
      theme: 'light',
      activeDependencyTypes: [],
      results: [],
    }),
  },
} satisfies Story;
