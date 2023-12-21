import type { Meta, StoryObj } from '@storybook/react';
import { TooltipDependency } from '@commonalityco/ui-constraints';
import { DependencyType } from '@commonalityco/utils-core';

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta = {
  title: 'ui-graph/TooltipDependency',
  component: TooltipDependency,
  tags: ['autodocs'],
  argTypes: {},
  parameters: {
    backgrounds: {
      default: 'light/secondary',
    },
  },
} satisfies Meta<typeof TooltipDependency>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Simple: Story = {
  args: {
    results: [
      {
        isValid: false,
        constraint: {
          allow: ['tag-one'],
          disallow: '*',
        },
        dependencyPath: [
          {
            source: 'pkg-one',
            target: 'pkg-two',
            type: DependencyType.PRODUCTION,
            version: '1.0.0',
          },
        ],
        foundTags: ['tag-one'],
        filter: '*',
      },
      {
        isValid: true,
        constraint: {
          allow: ['tag-one'],
          disallow: ['tag-two'],
        },
        dependencyPath: [
          {
            source: 'pkg-one',
            target: 'pkg-two',
            type: DependencyType.DEVELOPMENT,
            version: '1.0.0',
          },
        ],
        foundTags: ['tag-one'],
        filter: 'tag-one',
      },
    ],
    dependencies: [
      {
        type: DependencyType.PRODUCTION,
        version: '1.0.0',
        target: 'pkg-two',
        source: 'pkg-one',
      },
      {
        type: DependencyType.DEVELOPMENT,
        version: '>=0',
        target: 'pkg-two',
        source: 'pkg-one',
      },
    ],
  },
};

export const Empty: Story = {
  args: {
    results: [],
    dependencies: [
      {
        type: DependencyType.PRODUCTION,
        version: '1.0.0',
        target: '@scope/target',
        source: '@scope/source',
      },
    ],
  },
};
