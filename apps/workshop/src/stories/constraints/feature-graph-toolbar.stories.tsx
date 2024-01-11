import { Meta, StoryObj } from '@storybook/react';
import { FeatureGraphToolbar } from '@commonalityco/ui-constraints';
import { GraphProvider } from '@commonalityco/ui-graph';
import { Violation } from '@commonalityco/types';

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta = {
  title: 'Constraints/FeatureGraphToolbar',
  component: FeatureGraphToolbar,
  tags: ['autodocs'],
  argTypes: {},
  parameters: {
    backgrounds: {
      default: 'light/secondary',
    },
  },
  decorators: [
    (Story, props) => {
      return (
        <GraphProvider>
          <Story {...props} />
        </GraphProvider>
      );
    },
  ],
} satisfies Meta<typeof FeatureGraphToolbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const KitchenSink: Story = {
  args: {
    packages: [],
    constraints: {
      'tag-one-loooooooooooooooooooooooooooooooooooooooooooooooooonnnnnnggggggggggggg':
        {
          allow: [
            'tag-two-loooooooooooooooooooooooooooooooooooooooooooooooooonnnnnnggggggggggggg',
            'tag-three-loooooooooooooooooooooooooooooooooooooooooooooooooonnnnnnggggggggggggg',
            'one',
            'two',
            'three',
          ],
          disallow: [
            'bar-loooooooooooooooooooooooooooooooooooooooooooooooooonnnnnnggggggggggggg',
          ],
        },
      'tag-two': { allow: ['tag-two', 'tag-three'], disallow: ['tag-four'] },
      'tag-three': { disallow: ['tag-four'] },
      'tag-four': { allow: '*', disallow: ['tag-four'] },
    },
    violations: [
      {
        sourcePackageName:
          'pkg-a-looooooooooooooooooooooooooooooonnnnnnnnnnnnnnnnnnnngggggggggggggggggggggggg',
        targetPackageName:
          'pkg-b-looooooooooooooooooooooooooooooonnnnnnnnnnnnnnnnnnnngggggggggggggggggggggggg',
        appliedTo:
          'tag-one-loooooooooooooooooooooooooooooooooooooooooooooooooonnnnnnggggggggggggg',
        allowed: [
          'tag-two-loooooooooooooooooooooooooooooooooooooooooooooooooonnnnnnggggggggggggg',
          'tag-three-loooooooooooooooooooooooooooooooooooooooooooooooooonnnnnnggggggggggggg',
        ],
        disallowed: [],
        found: [
          'bar-loooooooooooooooooooooooooooooooooooooooooooooooooonnnnnnggggggggggggg',
          'foo-loooooooooooooooooooooooooooooooooooooooooooooooooonnnnnnggggggggggggg',
          'one',
          'two',
          'three',
        ],
      },
      {
        sourcePackageName: 'pkg-b',
        targetPackageName: 'pkg-c',
        appliedTo: 'tag-two',
        allowed: ['tag-two', 'tag-three'],
        disallowed: [],
        found: ['tag-bar'],
      },
      {
        sourcePackageName: 'pkg-b',
        targetPackageName: 'pkg-d',
        appliedTo: 'tag-two',
        allowed: ['tag-two', 'tag-three'],
        disallowed: [],
        found: [],
      },
      {
        sourcePackageName: 'pkg-c',
        targetPackageName: 'pkg-d',
        appliedTo: 'tag-one',
        allowed: ['tag-two', 'tag-three'],
        disallowed: [],
        found: [],
      },
    ] satisfies Violation[],
  },
};

export const NoConstraints: Story = {
  args: {
    packages: [],
    constraints: {},
    violations: [],
  },
};
