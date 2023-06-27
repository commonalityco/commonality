import type { Meta, StoryObj } from '@storybook/react';
import {
  FeatureGraphLayout,
  FeatureGraphToolbar,
} from '@commonalityco/feature-graph';
import { PackageManager } from '@commonalityco/utils-core';

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta = {
  title: 'Features/Graph/FeatureGraphToobar',
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
        <FeatureGraphLayout>
          <Story {...props} />
        </FeatureGraphLayout>
      );
    },
  ],
} satisfies Meta<typeof FeatureGraphToolbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Pnpm: Story = {
  args: {
    packageManager: PackageManager.PNPM,
    totalPackageCount: 100,
    violations: [
      {
        sourceName: 'pkg-a',
        targetName: 'pkg-b',
        matchTags: ['tag-one'],
        allowedTags: ['tag-two', 'tag-three'],
        foundTags: [],
      },
    ],
  },
};
