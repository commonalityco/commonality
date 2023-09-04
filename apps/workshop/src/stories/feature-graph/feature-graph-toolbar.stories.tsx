import type { Meta, StoryObj } from '@storybook/react';
import {
  FeatureGraphToolbar,
  GraphProvider,
} from '@commonalityco/feature-graph';
import { PackageManager } from '@commonalityco/utils-core';
import { Violation } from '@commonalityco/types';

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta = {
  title: 'feature-graph/FeatureGraphToolbar',
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
    packageManager: PackageManager.PNPM,
    getPackages: async () => [],
    getProjectConfig: async () => ({
      constraints: [
        {
          applyTo:
            'tag-one-loooooooooooooooooooooooooooooooooooooooooooooooooonnnnnnggggggggggggg',
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
        {
          applyTo: 'tag-two',
          allow: ['tag-two', 'tag-three'],
          disallow: ['tag-four'],
        },
        {
          applyTo: 'tag-three',
          disallow: ['tag-four'],
        },
        {
          applyTo: 'tag-four',
          allow: '*',
          disallow: ['tag-four'],
        },
      ],
    }),
    getViolations: async () =>
      [
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
    packageManager: PackageManager.PNPM,
    getPackages: async () => [],
    getProjectConfig: async () => ({}),
    getViolations: async () => [],
  },
};
