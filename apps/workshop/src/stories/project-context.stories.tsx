import type { Meta, StoryObj } from '@storybook/react';

import { PackageContext, ProjectContext } from '@commonalityco/feature-graph';
import {
  DependencyType,
  PackageManager,
  PackageType,
  Status,
} from '@commonalityco/utils-core';

const meta: Meta<typeof PackageContext> = {
  component: PackageContext,
};

export default meta;
type Story = StoryObj<typeof PackageContext>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const KitchenSink: Story = {
  render: () => (
    <ProjectContext
      constraintPassCount={50}
      constraintFailCount={25}
      packageManager={PackageManager.NPM}
      projectName="example-project"
      packageCount={100}
      checkCount={100}
      score={87}
      checkPassCount={50}
      checkFailCount={25}
      checkWarnCount={25}
      checkResults={[
        {
          id: '1',
          filter: 'all',
          status: Status.Pass,
          package: {
            path: '/path/to/package',
            type: PackageType.NODE,
            name: 'example-package',
            description: 'This is an example package',
            version: '1.0.0',
          },
          message: {
            message: 'This rule makes sure that the package is valid',
          },
        },
        {
          id: '2',
          filter: 'all',
          status: Status.Pass,
          package: {
            path: '/path/to/package',
            type: PackageType.NODE,
            name: 'example-package',
            description: 'This is an example package',
            version: '1.0.0',
          },
          message: {
            message: 'This rule makes sure that the package is valid',
          },
        },
        {
          id: '3',
          filter: 'all',
          status: Status.Warn,
          package: {
            path: '/path/to/package',
            type: PackageType.NODE,
            name: 'example-package',
            description: 'This is an example package',
            version: '1.0.0',
          },
          message: {
            message: 'This rule makes sure that the package is valid',
          },
        },
        {
          id: '4',
          filter: 'all',
          status: Status.Warn,
          package: {
            path: '/path/to/package',
            type: PackageType.NODE,
            name: 'example-package',
            description: 'This is an example package',
            version: '1.0.0',
          },
          message: {
            message: 'This rule makes sure that the package is valid',
          },
        },
        {
          id: '5',
          filter: 'all',
          status: Status.Fail,
          package: {
            path: '/path/to/package',
            type: PackageType.NODE,
            name: 'example-package',
            description: 'This is an example package',
            version: '1.0.0',
          },
          message: {
            message: 'This rule makes sure that the package is valid',
          },
        },
      ]}
    />
  ),
};

export const Empty: Story = {
  render: () => (
    <ProjectContext
      constraintPassCount={0}
      constraintFailCount={0}
      packageManager={PackageManager.NPM}
      projectName="example-project"
      packageCount={0}
      checkCount={0}
      score={0}
      checkPassCount={0}
      checkFailCount={0}
      checkWarnCount={0}
      checkResults={[]}
    />
  ),
};
