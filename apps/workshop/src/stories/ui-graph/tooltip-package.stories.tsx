import type { Meta, StoryObj } from '@storybook/react';
import { TooltipPackage } from '@commonalityco/ui-graph';
import { PackageType } from '@commonalityco/utils-core';

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta = {
  title: 'ui-graph/TooltipPackage',
  component: TooltipPackage,
  tags: ['autodocs'],
  argTypes: {},
  args: {
    dependenciesCount: 10,
    dependentsCount: 20,
  },
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
    pkg: {
      name: '@scope/test',
      version: '1.0.0',
      description: 'This is a loooooooonnnnnnnnggggggg description.',
      path: './scope/test',
      type: PackageType.NODE,
    },
  },
};

export const NoAdditionalInfo: Story = {
  args: {
    pkg: {
      name: '@scope/test',
      version: '1.0.0',
      path: './scope/test',
      type: PackageType.NODE,
    },
  },
};

export const ExcessiveInfo: Story = {
  args: {
    pkg: {
      name: '@scope/looooooooooooooooooooooooooonnnnnnngggggggggggg',
      version: '1.0.0',
      description:
        'The picturesque landscape, adorned with verdant forests, meandering rivers, and towering mountains, captivated the hearts of travelers, who cherished the serenity and beauty of this idyllic haven',
      path: './scope/test',
      type: PackageType.NODE,
    },
  },
};
