import { Meta, StoryObj } from '@storybook/react';
import { ConstraintsDialog } from '@commonalityco/ui-constraints';
import { DependencyType } from '@commonalityco/utils-core';

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta = {
  title: 'Constraints/ConstraintsDialog',
  component: ConstraintsDialog,
  tags: ['autodocs'],
  argTypes: {},
  parameters: {
    backgrounds: {
      default: 'light/secondary',
    },
  },
} satisfies Meta<typeof ConstraintsDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    open: true,
    result: {
      isValid: true,
      constraint: {
        allow: ['tag-one'],
        disallow: ['tag-two'],
      },
      dependencyPath: [
        {
          source: 'pkg-a',
          target: 'pkg-b',
          type: DependencyType.DEVELOPMENT,
          version: '1.0.0',
        },
      ],
      filter: 'tag-one',
      foundTags: ['tag-one'],
    },
  },
};

export const WithLongPath: Story = {
  args: {
    open: true,
    result: {
      isValid: false,
      constraint: {
        allow: ['tag-one'],
        disallow: ['tag-two'],
      },
      dependencyPath: [
        {
          source: 'pkg-a',
          target: 'pkg-b',
          type: DependencyType.DEVELOPMENT,
          version: '1.0.0',
        },
        {
          source: 'pkg-b',
          target: 'pkg-c',
          type: DependencyType.DEVELOPMENT,
          version: '1.0.0',
        },
        {
          source: 'pkg-c',
          target: 'pkg-d',
          type: DependencyType.PRODUCTION,
          version: '1.0.0',
        },
      ],
      filter: 'tag-one',
      foundTags: ['tag-two'],
    },
  },
};
