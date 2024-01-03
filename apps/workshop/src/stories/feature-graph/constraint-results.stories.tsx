import { Meta, StoryObj } from '@storybook/react';
import { ConstraintResults } from '@commonalityco/ui-constraints';
import { DependencyType } from '@commonalityco/utils-core';

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta = {
  title: 'Constraints/ConstraintResults',
  component: ConstraintResults,
  tags: ['autodocs'],
  argTypes: {},
  parameters: {
    backgrounds: {
      default: 'light/secondary',
    },
  },
} satisfies Meta<typeof ConstraintResults>;

export default meta;
type Story = StoryObj<typeof meta>;

export const KitchenSink: Story = {
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
          {
            source: 'pkg-two',
            target:
              'pkg-threeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
            type: DependencyType.PRODUCTION,
            version: '1.0.0',
          },
        ],
        filter: '*',
      },
      {
        isValid: false,
        constraint: {
          allow: ['tag-one'],
          disallow: ['tag-three', 'tag-four'],
        },
        dependencyPath: [
          {
            source: 'pkg-one',
            target: 'pkg-two',
            type: DependencyType.PRODUCTION,
            version: '1.0.0',
          },
          {
            source: 'pkg-two',
            target: 'pkg-three',
            type: DependencyType.PRODUCTION,
            version: '1.0.0',
          },
        ],
        filter: 'tag-one',
        foundTags: ['tag-three'],
      },
      {
        isValid: true,
        constraint: {
          allow: '*',
        },
        dependencyPath: [
          {
            source: 'pkg-one',
            target: 'pkg-two',
            type: DependencyType.PEER,
            version: '1.0.0',
          },
        ],
        foundTags: [
          'tag-three',
          'tag-looooooooooooooooooooooooooooooooooonnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnngggggggggggggggggggggggggggggggggggggggggggggggg',
        ],
        filter: 'tag-one',
      },
      {
        isValid: true,
        constraint: {
          allow: ['tag-one', 'tag-three'],
        },
        dependencyPath: [
          {
            source: 'pkg-five',
            target: 'pkg-six',
            type: DependencyType.PRODUCTION,
            version: '1.0.0',
          },
        ],
        foundTags: ['tag-three'],
        filter: 'tag-one',
      },
      {
        isValid: true,
        constraint: {
          allow: '*',
        },
        dependencyPath: [
          {
            source: 'pkg-five',
            target: 'pkg-seven',
            type: DependencyType.DEVELOPMENT,
            version: '1.0.0',
          },
        ],
        foundTags: ['tag-three'],
        filter: 'tag-one',
      },
    ],
  },
};

export const NoConstraints: Story = {
  args: {
    results: [],
  },
};
