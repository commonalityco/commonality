import type { Meta, StoryObj } from '@storybook/react';

import { PackageContext } from '@commonalityco/feature-graph';
import { DependencyType, PackageType, Status } from '@commonalityco/utils-core';

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
    <PackageContext
      codeownersData={[
        { packageName: 'example-package', codeowners: ['@user1', '@user2'] },
      ]}
      tagsData={[{ packageName: 'example-package', tags: ['tag1', 'tag2'] }]}
      pkg={{
        path: '/path/to/package',
        type: PackageType.NODE,
        name: 'example-package',
        description:
          'This is an example package and the description is very long. It is so long that it will wrap to the next line.',
        version: '1.0.0',
      }}
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

export const AllPassing: Story = {
  render: () => (
    <PackageContext
      codeownersData={[]}
      tagsData={[]}
      pkg={{
        path: '/path/to/package',
        type: PackageType.NODE,
        name: 'example-package',
        description: 'This is an example package',
        version: '1.0.0',
      }}
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
      ]}
    />
  ),
};

export const Empty: Story = {
  render: () => (
    <PackageContext
      codeownersData={[]}
      tagsData={[]}
      pkg={{
        path: '/path/to/package',
        type: PackageType.NODE,
        name: 'example-package',
        description: 'This is an example package',
        version: '1.0.0',
      }}
      checkResults={[]}
    />
  ),
};
