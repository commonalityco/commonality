import type { Meta, StoryObj } from '@storybook/react';
import {
  FeatureGraphChart,
  FeatureGraphLayout,
  GraphProvider,
} from '@commonalityco/feature-graph';
import { DependencyType, PackageType } from '@commonalityco/utils-core';
import { Dependency, Package, Violation } from '@commonalityco/types';

const meta = {
  title: 'Features/Graph/FeatureGraphChart',
  component: FeatureGraphChart,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    theme: 'light',
  },
  decorators: [
    (Story, props) => {
      const newWorker = new Worker(new URL('./feature-graph-worker.ts'));

      return (
        <div style={{ height: '600px', width: '100%' }}>
          <GraphProvider worker={newWorker}>
            <FeatureGraphLayout>
              <Story {...props} />
            </FeatureGraphLayout>
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
    violations: [],
    constraints: [],
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
    dependencies,
    constraints: [
      {
        applyTo: 'foo',
        allow: ['bar'],
        disallow: ['baz'],
      },
    ],
    violations,
  },
};

export const Zero: Story = {
  args: {
    packages: [],
    dependencies: [],
    constraints: [],
    violations: [],
  },
};