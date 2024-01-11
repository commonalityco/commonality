import { Meta, StoryObj } from '@storybook/react';
import { FeatureGraphChart } from '@commonalityco/ui-constraints';
import { GraphProvider } from '@commonalityco/ui-graph';
import { DependencyType, PackageType } from '@commonalityco/utils-core';
import { ConstraintResult, Dependency, Package } from '@commonalityco/types';
import { GraphLayoutMain } from '@commonalityco/ui-constraints';
import GraphWorker from './feature-graph-worker.ts?worker';
// const newWorker = new Worker(
//   new URL('./feature-graph-worker.ts', import.meta.url),
// );

const newWorker = new GraphWorker();

const meta = {
  title: 'Constraints/FeatureGraphChart',
  component: FeatureGraphChart,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    theme: 'light',
    worker: newWorker,
  },
  decorators: [
    (Story, props) => {
      return (
        <div style={{ height: '600px', width: '100%' }}>
          <GraphProvider>
            <GraphLayoutMain>
              <Story {...props} />
            </GraphLayoutMain>
          </GraphProvider>
        </div>
      );
    },
  ],
} satisfies Meta<typeof FeatureGraphChart>;

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
    packages,
    dependencies,
    results: [],
    constraints: {},
  },
};

const results = [
  {
    constraint: {
      allow: ['bar'],
    },
    dependencyPath: [
      {
        source: '@scope/pkg-a',
        target: '@scope/pkg-b',
        type: DependencyType.PRODUCTION,
        version: '1.0.0',
      },
    ],
    filter: 'foo',
    isValid: true,
    foundTags: ['foo', 'bar'],
  },
] satisfies ConstraintResult[];

export const ConstraintsAndViolations: Story = {
  args: {
    packages,
    dependencies,
    constraints: {
      foo: {
        allow: ['bar'],
        disallow: ['baz'],
      },
    },
    results,
  },
};

export const Zero: Story = {
  args: {
    packages: [],
    dependencies: [],
    constraints: {},
    results: [],
  },
};
