import type { Meta, StoryObj } from '@storybook/react';

import { DependencyContext } from '@commonalityco/feature-graph';
import { DependencyType } from '@commonalityco/utils-core';

const meta: Meta<typeof DependencyContext> = {
  component: DependencyContext,
};

export default meta;
type Story = StoryObj<typeof DependencyContext>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const KitchenSink: Story = {
  render: () => (
    <DependencyContext
      dependency={{
        source: '@scope/pkg-b',
        target: '@scope/pkg-c',
        type: DependencyType.DEVELOPMENT,
        version: '1.0.0',
      }}
      constraintResults={[
        {
          isValid: true,
          foundTags: ['stable', 'latest'],
          constraint: {
            allow: ['foo'],
          },
          dependencyPath: [
            {
              source: '@scope/pkg-a',
              target: '@scope/pkg-b',
              type: DependencyType.PRODUCTION,
              version: '1.0.0',
            },
            {
              source: '@scope/pkg-b',
              target: '@scope/pkg-c',
              type: DependencyType.DEVELOPMENT,
              version: '1.0.0',
            },
            {
              source: '@scope/pkg-c',
              target: '@scope/pkg-d',
              type: DependencyType.DEVELOPMENT,
              version: '1.0.0',
            },
          ],
          filter: 'utility',
        },
        {
          isValid: false,
          foundTags: ['stable', 'latest'],
          constraint: {
            disallow: ['foo'],
          },
          dependencyPath: [
            {
              source: '@scope/pkg-a',
              target: '@scope/pkg-b',
              type: DependencyType.PRODUCTION,
              version: '1.0.0',
            },
            {
              source: '@scope/pkg-b',
              target: '@scope/pkg-c',
              type: DependencyType.DEVELOPMENT,
              version: '1.0.0',
            },
          ],
          filter: 'buildable',
        },
        {
          isValid: false,
          foundTags: ['stable', 'latest'],
          constraint: {
            allow: '*',
          },
          dependencyPath: [
            {
              source: '@scope/pkg-f',
              target: '@scope/pkg-g',
              type: DependencyType.PRODUCTION,
              version: '1.0.0',
            },
          ],
          filter: 'team/scope/foo',
        },
      ]}
    />
  ),
};

export const Empty: Story = {
  render: () => (
    <DependencyContext
      dependency={{
        source: '@scope/pkg-a',
        target: '@scope/pkg-b',
        type: DependencyType.PRODUCTION,
        version: '1.0.0',
      }}
      constraintResults={[]}
    />
  ),
};
