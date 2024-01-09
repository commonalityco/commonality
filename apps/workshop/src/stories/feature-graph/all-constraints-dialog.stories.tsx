import { Meta, StoryObj } from '@storybook/react';
import { AllConstraintsDialog } from '@commonalityco/ui-constraints';
import { DependencyType } from '@commonalityco/utils-core';

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta = {
  title: 'Constraints/AllConstraintsDialog',
  component: AllConstraintsDialog,
  tags: ['autodocs'],
  argTypes: {},
  parameters: {
    backgrounds: {
      default: 'light/secondary',
    },
  },
} satisfies Meta<typeof AllConstraintsDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Results: Story = {
  args: {
    open: true,
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
          {
            source:
              'pkg-threeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
            target: 'pkg-four',
            type: DependencyType.PRODUCTION,
            version: '1.0.0',
          },
          {
            source: 'pkg-four',
            target: 'pkg-five',
            type: DependencyType.PRODUCTION,
            version: '1.0.0',
          },
          {
            source: 'pkg-five',
            target: 'pkg-six',
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
          {
            source: 'pkg-three',
            target: 'pkg-four',
            type: DependencyType.PRODUCTION,
            version: '1.0.0',
          },
        ],
        filter: 'tag-one',
        foundTags: ['tag-three'],
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
          {
            source: 'pkg-three',
            target: 'pkg-four',
            type: DependencyType.PRODUCTION,
            version: '1.0.0',
          },
        ],
        filter: 'tag-two',
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

export const Stress: Story = {
  args: {
    open: true,
    results: [
      {
        isValid: true,
        constraint: {
          allow: ['tag-one'],
          disallow: ['tag-two'],
        },
        dependencyPath: [
          {
            source:
              'pkg-loooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooonnnnnnng',
            target: 'pkg-b',
            type: DependencyType.DEVELOPMENT,
            version: '1.0.0',
          },
        ],
        filter: 'tag-one',
        foundTags: ['tag-one'],
      },
    ],
  },
};

export const NoResults: Story = {
  args: {
    open: true,
    results: [],
  },
};
