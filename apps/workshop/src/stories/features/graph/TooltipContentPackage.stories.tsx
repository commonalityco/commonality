import type { Meta, StoryObj } from '@storybook/react';
import { TooltipPackage } from '@commonalityco/ui-graph';

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta = {
  title: 'Features/Graph/TooltipPackage',
  component: TooltipPackage,
  tags: ['autodocs'],
  argTypes: {},
  parameters: {
    backgrounds: {
      default: 'light/secondary',
    },
  },
} satisfies Meta<typeof TooltipPackage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Simple: Story = {
  args: {
    node: {
      data: {
        name: '@scope/test',
        version: '1.0.0',
        description: 'This is a loooooooonnnnnnnnggggggg description.',
        path: './scope/test',
        tags: ['tag-one', 'tag-two', 'tag-three', 'tag-four', 'tag-five'],
        owners: ['owner-one', 'owner-two', 'owner-three'],
        dependencies: [
          { name: 'react', version: '18', type: 'PRODUCTION' as any },
        ],
        devDependencies: [],
        peerDependencies: [],
      },
    },
  },
};

export const NoAdditionalInfo: Story = {
  args: {
    node: {
      data: {
        name: '@scope/test',
        version: '1.0.0',
        path: './scope/test',
        tags: [],
        owners: [],
        dependencies: [
          { name: 'react', version: '18', type: 'PRODUCTION' as any },
        ],
        devDependencies: [],
        peerDependencies: [],
      },
    },
  },
};

export const ExcessiveInfo: Story = {
  args: {
    node: {
      data: {
        name: '@scope/looooooooooooooooooooooooooonnnnnnngggggggggggg',
        version: '1.0.0',
        description:
          'The picturesque landscape, adorned with verdant forests, meandering rivers, and towering mountains, captivated the hearts of travelers, who cherished the serenity and beauty of this idyllic haven',
        path: './scope/test',
        tags: [
          'tag-one',
          'tag-two',
          'tag-three',
          'tag-four',
          'tag-five',
          'tag-six',
          'tag-seven',
          'tag-eight',
          'tag-nine',
          'tag-ten',
        ],
        owners: [
          '@scope/owner-one',
          '@scope/owner-two',
          '@scope/owner-three',
          '@scope/owner-four',
          '@scope/owner-five',
          '@scope/owner-six',
          '@scope/owner-seven',
          '@scope/owner-eight',
          '@scope/owner-nine',
          '@scope/owner-ten',
        ],
        dependencies: [
          { name: 'react', version: '18', type: 'PRODUCTION' as any },
        ],
        devDependencies: [],
        peerDependencies: [],
      },

      element: {
        id: () => '@scope/test',
        incomers: () => ({ nodes: () => [null] }),
        outgoers: () => ({ nodes: () => [null, null] }),
      },
    },
  },
};
