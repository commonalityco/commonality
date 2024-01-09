import { Meta, StoryObj } from '@storybook/react';
import { DependencyConstraintsDialog } from '@commonalityco/ui-constraints';
import { DependencyType } from '@commonalityco/utils-core';

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta = {
  title: 'Constraints/DependencyConstraintsDialog',
  component: DependencyConstraintsDialog,
  tags: ['autodocs'],
  argTypes: {},
  parameters: {
    backgrounds: {
      default: 'light/secondary',
    },
  },
} satisfies Meta<typeof DependencyConstraintsDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithConstraints: Story = {
  args: {
    open: true,
    dependencies: [
      {
        source: 'pkg-a',
        target: 'pkg-b',
        version: '1.0.0',
        type: DependencyType.DEVELOPMENT,
      },
      {
        source: 'pkg-a',
        target: 'pkg-b',
        version: '1.0.0',
        type: DependencyType.PEER,
      },
    ],
    results: [
      {
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
      {
        isValid: false,
        constraint: {
          allow: ['tag-two'],
          disallow: '*',
        },
        dependencyPath: [
          {
            source: 'pkg-a',
            target: 'pkg-b',
            type: DependencyType.PEER,
            version: '1.0.0',
          },
        ],
        filter: 'tag-two',
        foundTags: ['tag-two'],
      },
    ],
  },
};

export const Stress: Story = {
  args: {
    open: true,
    dependencies: [
      {
        source:
          'pkg-loooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooonnnnngg',
        target:
          'pkg-loooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooonnnnnggg',
        version: '1.0.0',
        type: DependencyType.DEVELOPMENT,
      },
    ],
    results: [],
  },
};

export const NoConstraints: Story = {
  args: {
    open: true,
    dependencies: [
      {
        source: 'pkg-a',
        target: 'pkg-b',
        version: '1.0.0',
        type: DependencyType.DEVELOPMENT,
      },
    ],
    results: [],
  },
};
